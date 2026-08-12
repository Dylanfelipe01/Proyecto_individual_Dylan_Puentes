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


taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

   
    const titleValue = document.querySelector('#taskTitle').value;
    const descValue = document.querySelector('#taskDesc').value;
    const priorityValue = document.querySelector('#taskPriority').value;
    const statusValue = document.querySelector('#taskStatus').value;
    const dueDateValue = document.querySelector('#taskDueDate').value;

    const taskData = {
        title: titleValue,
        description: descValue,
        priority: priorityValue,
        status: statusValue,
        dueDate: dueDateValue
    };

   
    const isValid = validFormFieldInput(taskData);

    if (!isValid) {
        alertError.classList.remove('d-none');
    } else {
        alertError.classList.add('d-none');

        createTaskCard(taskData);

       
        taskForm.reset();
    }
});


function createTaskCard(task) {
   
    let borderClass = 'border-gta-warning';
    let badgeClass = 'badge-gta-warning';

    if (task.priority === 'Alta') {
        borderClass = 'border-gta-danger';
        badgeClass = 'badge-gta-danger';
    } else if (task.priority === 'Baja') {
        borderClass = 'border-gta-success';
        badgeClass = 'badge-gta-success';
    }

   
    const colDiv = document.createElement('div');
    colDiv.className = 'col-12 col-lg-6';

   
    colDiv.innerHTML = `
        <div class="card h-100 gta-task-card ${borderClass}">
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

                    <h3 class="h6 fw-bold mb-2 text-white">${task.title}</h3>
                    <p class="small mb-3 gta-task-desc">${task.description}</p>
                </div>

                <div class="pt-2 border-top border-secondary d-flex align-items-center justify-content-between">
                    <span class="badge bg-dark border border-secondary text-warning">${task.status}</span>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-gta-edit p-0" title="Editar misión">
                            <i class="bi bi-pencil-square fs-6"></i>
                        </button>
                        <button class="btn btn-sm text-danger p-0" title="Eliminar misión" onclick="this.closest('.col-12').remove()">
                            <i class="bi bi-trash-fill fs-6"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

   
    taskList.prepend(colDiv);
}