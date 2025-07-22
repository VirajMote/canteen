import { pgTable, text, serial, integer, boolean, jsonb, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  rollNumber: text("roll_number").notNull().unique(),
  name: text("name").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  isVeg: boolean("is_veg").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  popularCategory: text("popular_category"), // "veg", "non-veg", "breakfast", "south-indian"
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  items: jsonb("items").notNull(), // Array of {dishId, quantity, price}
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("placed"), // placed, confirmed, preparing, ready, completed
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  rollNumber: true,
  name: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  image: true,
});

export const insertDishSchema = createInsertSchema(dishes).pick({
  name: true,
  price: true,
  image: true,
  categoryId: true,
  isVeg: true,
  isPopular: true,
  popularCategory: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  studentId: true,
  items: true,
  total: true,
  paymentMethod: true,
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Dish = typeof dishes.$inferSelect;
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export interface CartItem {
  dishId: number;
  quantity: number;
  dish: Dish;
}
