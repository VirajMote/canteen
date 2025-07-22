import { students, categories, dishes, orders, type Student, type InsertStudent, type Category, type InsertCategory, type Dish, type InsertDish, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Students
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRollNumber(rollNumber: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Dishes
  getDishes(): Promise<Dish[]>;
  getDishesByCategory(categoryId: number): Promise<Dish[]>;
  getPopularDishes(): Promise<Dish[]>;
  getPopularDishesByCategory(popularCategory: string): Promise<Dish[]>;
  getDish(id: number): Promise<Dish | undefined>;
  createDish(dish: InsertDish): Promise<Dish>;
  searchDishes(query: string): Promise<Dish[]>;
  
  // Orders
  getOrdersByStudent(studentId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  private categories: Map<number, Category>;
  private dishes: Map<number, Dish>;
  private orders: Map<number, Order>;
  private currentStudentId: number;
  private currentCategoryId: number;
  private currentDishId: number;
  private currentOrderId: number;

  constructor() {
    this.students = new Map();
    this.categories = new Map();
    this.dishes = new Map();
    this.orders = new Map();
    this.currentStudentId = 1;
    this.currentCategoryId = 1;
    this.currentDishId = 1;
    this.currentOrderId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoriesData = [
      { name: "South Indian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "North Indian", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Snacks", image: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Beverages", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" }
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Initialize dishes
    const dishesData = [
      // Popular dishes of all time
      { name: "Coffee", price: "15.00", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: true, popularCategory: null },
      { name: "Masala Tea", price: "12.00", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: true, popularCategory: null },
      { name: "Vada Pav", price: "25.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: true, popularCategory: "veg" },
      { name: "Samosa", price: "20.00", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: true, popularCategory: null },
      
      // Popular by category
      { name: "Chicken Roll", price: "65.00", image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: false, isPopular: false, popularCategory: "non-veg" },
      { name: "Egg Roll", price: "55.00", image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: false, isPopular: false, popularCategory: "non-veg" },
      { name: "Chicken Biryani", price: "85.00", image: "https://images.unsplash.com/photo-1563379091339-03246963d999?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: false, isPopular: false, popularCategory: "non-veg" },
      
      { name: "Poha", price: "30.00", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "breakfast" },
      { name: "Upma", price: "25.00", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "breakfast" },
      { name: "Paratha with Curd", price: "40.00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "breakfast" },
      { name: "Bread Omelet", price: "35.00", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: false, isPopular: false, popularCategory: "breakfast" },
      
      { name: "Idli (2pc)", price: "35.00", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: "south-indian" },
      { name: "Dosa", price: "45.00", image: "https://images.unsplash.com/photo-1694844618152-c11b3d83b1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: "south-indian" },
      { name: "Uttapam", price: "40.00", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: "south-indian" },
      { name: "Vada (2pc)", price: "30.00", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Sambhar Vada", price: "35.00", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: "south-indian" },
      { name: "Rava Dosa", price: "50.00", image: "https://images.unsplash.com/photo-1694844618152-c11b3d83b1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Set Dosa (3pc)", price: "55.00", image: "https://images.unsplash.com/photo-1694844618152-c11b3d83b1eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 1, isVeg: true, isPopular: false, popularCategory: null },
      
      { name: "Fried Rice", price: "55.00", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Vegetable Noodles", price: "50.00", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Manchurian", price: "45.00", image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Spring Roll", price: "40.00", image: "https://images.unsplash.com/photo-1544782858-7e86be0a56b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Chicken Fried Rice", price: "75.00", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: false, isPopular: false, popularCategory: null },
      { name: "Chicken Noodles", price: "70.00", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 2, isVeg: false, isPopular: false, popularCategory: null },
      
      { name: "Roti with Dal", price: "45.00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "veg" },
      { name: "Rajma Rice", price: "60.00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "veg" },
      { name: "Chole Bhature", price: "55.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: "veg" },
      { name: "Paneer Butter Masala", price: "80.00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Dal Makhani", price: "70.00", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 3, isVeg: true, isPopular: false, popularCategory: null },
      
      { name: "Pav Bhaji", price: "50.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: "veg" },
      { name: "Bhel Puri", price: "35.00", image: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Sev Puri", price: "30.00", image: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Pani Puri", price: "25.00", image: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Dahi Puri", price: "35.00", image: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Aloo Tikki", price: "30.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Chole Tikki", price: "40.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Misal Pav", price: "45.00", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 4, isVeg: true, isPopular: false, popularCategory: null },
      
      { name: "Fresh Lime Water", price: "20.00", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Sweet Lassi", price: "25.00", image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Salt Lassi", price: "25.00", image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Mango Lassi", price: "35.00", image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Fresh Juice (Seasonal)", price: "30.00", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Buttermilk", price: "20.00", image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Cold Coffee", price: "30.00", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 5, isVeg: true, isPopular: false, popularCategory: null },
      
      { name: "Gulab Jamun", price: "40.00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Rasmalai", price: "45.00", image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Rasgulla", price: "35.00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Jalebi", price: "30.00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Ice Cream Cup", price: "25.00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null },
      { name: "Kulfi", price: "20.00", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", categoryId: 6, isVeg: true, isPopular: false, popularCategory: null }
    ];

    dishesData.forEach(dish => {
      const dishObj: Dish = { ...dish, id: this.currentDishId++ };
      this.dishes.set(dishObj.id, dishObj);
    });
  }

  // Students
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.rollNumber === rollNumber,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Dishes
  async getDishes(): Promise<Dish[]> {
    return Array.from(this.dishes.values());
  }

  async getDishesByCategory(categoryId: number): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(dish => dish.categoryId === categoryId);
  }

  async getPopularDishes(): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(dish => dish.isPopular);
  }

  async getPopularDishesByCategory(popularCategory: string): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter(dish => dish.popularCategory === popularCategory);
  }

  async getDish(id: number): Promise<Dish | undefined> {
    return this.dishes.get(id);
  }

  async createDish(insertDish: InsertDish): Promise<Dish> {
    const id = this.currentDishId++;
    const dish: Dish = { ...insertDish, id };
    this.dishes.set(id, dish);
    return dish;
  }

  async searchDishes(query: string): Promise<Dish[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.dishes.values()).filter(dish => 
      dish.name.toLowerCase().includes(searchTerm)
    );
  }

  // Orders
  async getOrdersByStudent(studentId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "placed",
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
