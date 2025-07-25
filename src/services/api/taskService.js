import mockTasks from "@/services/mockData/tasks.json";

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    await delay();
    return [...this.tasks];
  }

  async getById(id) {
    await delay();
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return { ...task };
  }

  async create(taskData) {
    await delay();
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      completed: false,
      priority: taskData.priority || "medium",
      categoryId: taskData.categoryId,
      dueDate: taskData.dueDate,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay();
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    
    this.tasks.splice(index, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await delay();
    return this.tasks.filter(t => t.categoryId === categoryId.toString());
  }

  async markComplete(id) {
    return this.update(id, { 
      completed: true, 
      completedAt: new Date().toISOString() 
    });
  }

  async markIncomplete(id) {
    return this.update(id, { 
      completed: false, 
      completedAt: null 
    });
  }
}

export const taskService = new TaskService();