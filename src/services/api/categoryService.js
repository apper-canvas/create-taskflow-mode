import mockCategories from "@/services/mockData/categories.json";

// Simulate API delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...mockCategories];
  }

  async getAll() {
    await delay();
    return [...this.categories].sort((a, b) => a.order - b.order);
  }

  async getById(id) {
    await delay();
    const category = this.categories.find(c => c.Id === parseInt(id));
    if (!category) throw new Error("Category not found");
    return { ...category };
  }

  async create(categoryData) {
    await delay();
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const maxOrder = Math.max(...this.categories.map(c => c.order), 0);
    
    const newCategory = {
      Id: maxId + 1,
      name: categoryData.name,
      color: categoryData.color || "#5B47E0",
      icon: categoryData.icon || "Folder",
      taskCount: 0,
      order: maxOrder + 1
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Category not found");
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay();
    const index = this.categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Category not found");
    
    this.categories.splice(index, 1);
    return true;
  }
}

export const categoryService = new CategoryService();