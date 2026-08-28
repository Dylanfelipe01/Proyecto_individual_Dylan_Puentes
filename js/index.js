const taskManager = new TaskManager();
const taskForm = document.querySelector('#taskForm');
const alertError = document.querySelector('#alertError');


function validFormFieldInput(data) {
    const { title, description, priority, status, dueDate } = data;

    if (!title || title.trim() === '') return false;
    if (!description || description.trim() === '') return false;
    if (!priority || priority.trim() === '') return false;
    if (!status || status.trim() === '') return false;
    if (!dueDate || dueDate.trim() === '') return false;

    return true;
}


taskForm.addEventListener('submit', function(event) {
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

      
        taskManager.addTask(title, description, dueDate, status);

        console.log(taskManager.tasks);

       
        taskForm.reset();
    }
});