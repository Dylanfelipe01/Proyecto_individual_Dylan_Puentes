const taskManager = new TaskManager();

const taskForm = document.querySelector('#taskForm');
const alertError = document.querySelector('#alertError');
const taskList = document.querySelector('#taskList');
const filterButtons = document.querySelectorAll('#filterGroup button');
const submitBtn = taskForm.querySelector('button[type="submit"]');
const cardTemplate = document.querySelector('#taskCardTemplate');

let currentEditId = null;

function validFormFieldInput(data) {
    const { title, description, priority, status, dueDate } = data;

    if (!title || title.trim() === '') return false;
    if (!description || description.trim() === '') return false;
    if (!priority || priority.trim() === '') return false;
    if (!status || status.trim() === '') return false;
    if (!dueDate || dueDate.trim() === '') return false;

    return true;
}

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.querySelector('#taskTitle').value;
    const description = document.querySelector('#taskDesc').value;
    const priority = document.querySelector('#taskPriority').value;
    const status = document.querySelector('#taskStatus').value;
    const dueDate = document.querySelector('#taskDueDate').value;

    const taskData = { title, description, priority, status, dueDate };
    const isValid = validFormFieldInput(taskData);

    if (!isValid) {
        alertError.classList.remove('d-none');
    } else {
        alertError.classList.add('d-none');

        if (currentEditId) {
            taskManager.updateTask(currentEditId, title, description, priority, dueDate, status);
            resetFormState();
        } else {
            taskManager.addTask(title, description, priority, dueDate, status);
            taskForm.reset();
        }

        renderAllTasks();
        console.log('Misiones actualizadas:', taskManager.tasks);
    }
});

function renderAllTasks() {
    taskList.innerHTML = '';

    taskManager.tasks.forEach(task => {
        const clone = cardTemplate.content.cloneNode(true);
        const colDiv = clone.firstElementChild;

        colDiv.dataset.id = task.id;

        const cardNode = colDiv.querySelector('.app-task-card');
        const priorityBadge = colDiv.querySelector('.priority-badge');
        const isCompleted = task.status === 'Completada';

        // Clases según prioridad
        if (task.priority === 'Alta') {
            cardNode.classList.add('border-theme-danger');
            priorityBadge.classList.add('badge-theme-danger');
        } else if (task.priority === 'Baja') {
            cardNode.classList.add('border-theme-success');
            priorityBadge.classList.add('badge-theme-success');
        } else {
            cardNode.classList.add('border-theme-warning');
            priorityBadge.classList.add('badge-theme-warning');
        }

        // Tarea completada
        cardNode.classList.toggle('opacity-75', isCompleted);
        cardNode.classList.toggle('completed', isCompleted);

        // DOM
        priorityBadge.textContent = task.priority;
        colDiv.querySelector('.task-date').textContent = task.dueDate;
        colDiv.querySelector('.task-title').textContent = task.title;
        colDiv.querySelector('.task-desc').textContent = task.description;
        colDiv.querySelector('.status-badge').textContent = task.status;

        const chkComplete = colDiv.querySelector('.chk-complete');
        chkComplete.checked = isCompleted;

        
        chkComplete.addEventListener('change', (e) => {
            taskManager.toggleTaskStatus(task.id, e.target.checked);
            renderAllTasks();
            console.log('Misiones actualizadas:', taskManager.tasks);
        });

        colDiv.querySelector('.btn-edit').addEventListener('click', () => {
            populateFormForEdit(task);
        });

        colDiv.querySelector('.btn-delete').addEventListener('click', () => {
            if (currentEditId === task.id) {
                resetFormState();
            }
            taskManager.deleteTask(task.id);
            renderAllTasks();
            console.log('Misiones actualizadas:', taskManager.tasks);
        });

        taskList.prepend(colDiv);
    });

    refreshCurrentFilter();
}

function populateFormForEdit(task) {
    currentEditId = task.id;

    document.querySelector('#taskTitle').value = task.title;
    document.querySelector('#taskDesc').value = task.description;
    document.querySelector('#taskPriority').value = task.priority;
    document.querySelector('#taskStatus').value = task.status;
    document.querySelector('#taskDueDate').value = task.dueDate;

    submitBtn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Actualizar Misión';
    submitBtn.classList.replace('btn-theme-primary', 'btn-warning');
}

function resetFormState() {
    currentEditId = null;
    taskForm.reset();

    submitBtn.innerHTML = '<i class="bi bi-star-fill"></i> Iniciar Misión';
    submitBtn.classList.replace('btn-warning', 'btn-theme-primary');
}

// Filtros
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
        const taskId = card.dataset.id;
        const task = taskManager.getTaskById(taskId);

        if (!task) return;

        if (filterType === 'todas') {
            card.classList.remove('d-none');
        } else if (filterType === 'pendientes') {
            if (task.status === 'Pendiente' || task.status === 'En Proceso') {
                card.classList.remove('d-none');
            } else {
                card.classList.add('d-none');
            }
        } else if (filterType === 'pasadas') {
            if (task.status === 'Completada') {
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