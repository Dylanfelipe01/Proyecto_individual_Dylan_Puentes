function validFormFieldInput(data) {
    const { title, description, priority, status, dueDate } = data;

    if (!title || title.trim() === '') return false;
    if (!description || description.trim() === '') return false;
    if (!priority || priority.trim() === '') return false;
    if (!status || status.trim() === '') return false;
    if (!dueDate || dueDate.trim() === '') return false;

    return true;
}


const taskForm = document.querySelector('#taskForm');
const alertError = document.querySelector('#alertError');
const taskList = document.querySelector('#taskList');
const filterButtons = document.querySelectorAll('#filterGroup button');
const submitBtn = taskForm.querySelector('button[type="submit"]');

let currentEditCard = null;


taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskData = {
        title: document.querySelector('#taskTitle').value,
        description: document.querySelector('#taskDesc').value,
        priority: document.querySelector('#taskPriority').value,
        status: document.querySelector('#taskStatus').value,
        dueDate: document.querySelector('#taskDueDate').value
    };

    const isValid = validFormFieldInput(taskData);

    if (!isValid) {
        alertError.classList.remove('d-none');
    } else {
        alertError.classList.add('d-none');

        if (currentEditCard) {
            updateTaskCard(currentEditCard, taskData);
            resetFormState();
        } else {
            createTaskCard(taskData);
            taskForm.reset();
        }

        refreshCurrentFilter();
    }
});


function createTaskCard(task) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-12 col-lg-6';

    setCardDatasets(colDiv, task);
    renderCardContent(colDiv, task);

    taskList.prepend(colDiv);
}


function updateTaskCard(cardElement, task) {
    setCardDatasets(cardElement, task);
    renderCardContent(cardElement, task);
}


function setCardDatasets(element, task) {
    element.dataset.title = task.title;
    element.dataset.description = task.description;
    element.dataset.priority = task.priority;
    element.dataset.status = task.status;
    element.dataset.dueDate = task.dueDate;
}


function renderCardContent(colDiv, task) {
    let borderClass = 'border-gta-warning';
    let badgeClass = 'badge-gta-warning';

    if (task.priority === 'Alta') {
        borderClass = 'border-gta-danger';
        badgeClass = 'badge-gta-danger';
    } else if (task.priority === 'Baja') {
        borderClass = 'border-gta-success';
        badgeClass = 'badge-gta-success';
    }

    const isCompleted = task.status === 'Completada';

    colDiv.innerHTML = `
        <div class="card h-100 gta-task-card ${borderClass} ${isCompleted ? 'opacity-75' : ''}">
            <div class="card-body d-flex flex-column justify-content-between p-3">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${badgeClass} rounded-pill">
                            ${task.priority}
                        </span>
                        <span class="extra-small d-flex align-items-center gap-1 task-date-warning">
                            <i class="bi bi-calendar-event"></i>
                            <strong>${task.dueDate}</strong>
                        </span>
                    </div>

                    <h3 class="h6 fw-bold mb-2 text-white ${isCompleted ? 'text-decoration-line-through text-white' : ''}">${task.title}</h3>
                    <p class="small mb-3 gta-task-desc ${isCompleted ? 'text-white' : ''}">${task.description}</p>
                </div>

                <div class="pt-2 border-top border-secondary d-flex align-items-center justify-content-between">
                    <!-- CHECKBOX DE COMPLETADO + BADGE DE ESTADO -->
                    <div class="d-flex align-items-center gap-2">
                        <div class="form-check m-0">
                            <input class="form-check-input chk-complete" type="checkbox" ${isCompleted ? 'checked' : ''} title="Marcar como completada">
                        </div>
                        <span class="badge bg-dark border border-secondary text-warning status-badge">${task.status}</span>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-gta-edit p-0 btn-edit" title="Editar misión">
                            <i class="bi bi-pencil-square fs-6"></i>
                        </button>
                        <button class="btn btn-sm text-danger p-0 btn-delete" title="Eliminar misión">
                            <i class="bi bi-trash-fill fs-6"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

   
    const chkComplete = colDiv.querySelector('.chk-complete');
    chkComplete.addEventListener('change', (e) => {
        if (e.target.checked) {
            colDiv.dataset.status = 'Completada';
        } else {
            colDiv.dataset.status = 'Pendiente';
        }

       
        renderCardContent(colDiv, {
            title: colDiv.dataset.title,
            description: colDiv.dataset.description,
            priority: colDiv.dataset.priority,
            status: colDiv.dataset.status,
            dueDate: colDiv.dataset.dueDate
        });

     
        refreshCurrentFilter();
    });

   
    colDiv.querySelector('.btn-edit').addEventListener('click', () => {
        populateFormForEdit(colDiv);
    });

    
    colDiv.querySelector('.btn-delete').addEventListener('click', () => {
        if (currentEditCard === colDiv) {
            resetFormState();
        }
        colDiv.remove();
        refreshCurrentFilter();
    });
}


function populateFormForEdit(cardElement) {
    currentEditCard = cardElement;

    document.querySelector('#taskTitle').value = cardElement.dataset.title;
    document.querySelector('#taskDesc').value = cardElement.dataset.description;
    document.querySelector('#taskPriority').value = cardElement.dataset.priority;
    document.querySelector('#taskStatus').value = cardElement.dataset.status;
    document.querySelector('#taskDueDate').value = cardElement.dataset.dueDate;

    submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Actualizar Misión';
    submitBtn.classList.replace('btn-gta-primary', 'btn-warning');
}


function resetFormState() {
    currentEditCard = null;
    taskForm.reset();

    submitBtn.innerHTML = '<i class="bi bi-star-fill"></i> Iniciar Misión';
    submitBtn.classList.replace('btn-warning', 'btn-gta-primary');
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterType = button.getAttribute('data-filter');
        applyFilter(filterType);
    });
});

function applyFilter(filterType) {
    const taskCards = document.querySelectorAll('#taskList > div');

    taskCards.forEach(card => {
        const cardStatus = card.dataset.status;

        if (filterType === 'todas') {
            card.classList.remove('d-none');
        } else if (filterType === 'pendientes') {
            if (cardStatus === 'Pendiente' || cardStatus === 'En Proceso') {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        } else if (filterType === 'pasadas') {
            if (cardStatus === 'Completada') {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        }
    });
}

function refreshCurrentFilter() {
    const activeFilterBtn = document.querySelector('#filterGroup button.active');
    if (activeFilterBtn) {
        applyFilter(activeFilterBtn.getAttribute('data-filter'));
    }
}

const taskManager = new TaskManager();
console.log(taskManager.tasks);