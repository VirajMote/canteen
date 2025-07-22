import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { rollNumber } = req.body;
      
      if (!rollNumber) {
        return res.status(400).json({ message: "Roll number is required" });
      }

      // Check if student exists
      let student = await storage.getStudentByRollNumber(rollNumber);
      
      if (!student) {
        // Create new student account - generate name from roll number
        const name = generateStudentName(rollNumber);
        student = await storage.createStudent({ rollNumber, name });
      }

      res.json({ student });
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get all dishes
  app.get("/api/dishes", async (req, res) => {
    try {
      const { categoryId, popular, popularCategory, search } = req.query;
      
      let dishes;
      if (search) {
        dishes = await storage.searchDishes(search as string);
      } else if (categoryId) {
        dishes = await storage.getDishesByCategory(parseInt(categoryId as string));
      } else if (popular === "true") {
        dishes = await storage.getPopularDishes();
      } else if (popularCategory) {
        dishes = await storage.getPopularDishesByCategory(popularCategory as string);
      } else {
        dishes = await storage.getDishes();
      }
      
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dishes" });
    }
  });

  // Get dish by ID
  app.get("/api/dishes/:id", async (req, res) => {
    try {
      const dish = await storage.getDish(parseInt(req.params.id));
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }
      res.json(dish);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dish" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Get orders by student
  app.get("/api/students/:studentId/orders", async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const orders = await storage.getOrdersByStudent(studentId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(parseInt(req.params.id), status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateStudentName(rollNumber: string): string {
  // Simple name generation from roll number
  const names = ["Rahul Kumar", "Priya Sharma", "Amit Singh", "Neha Patel", "Rohit Gupta", "Sneha Jain"];
  const hash = rollNumber.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return names[hash % names.length];
}
