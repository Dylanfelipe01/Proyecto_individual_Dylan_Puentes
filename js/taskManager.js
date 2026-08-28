class TaskManager { 
    constructor(currentId = 0) { 
        this.tasks = []; 
        this.currentId = currentId;
    } 

    addTask(name, description, dueDate, status = 'Pendiente') {
        this.currentId++;

        const newTask = {
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: status
        };

        this.tasks.push(newTask);
        return newTask;
    }
}