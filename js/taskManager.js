class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(title, description, priority, dueDate, status = 'Pendiente') {
        this.currentId++;

        const newTask = {
            id: this.currentId,
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            status: status
        };

        this.tasks.push(newTask);
        return newTask;
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === Number(id));
    }

    updateTask(id, title, description, priority, dueDate, status) {
        const task = this.getTaskById(id);
        if (task) {
            task.title = title;
            task.description = description;
            task.priority = priority;
            task.dueDate = dueDate;
            task.status = status;
        }
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== Number(id));
    }

    toggleTaskStatus(id, isCompleted) {
        const task = this.getTaskById(id);
        if (task) {
            task.status = isCompleted ? 'Completada' : 'Pendiente';
        }
        return task;
    }
}