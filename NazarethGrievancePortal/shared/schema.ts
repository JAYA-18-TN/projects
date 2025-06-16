import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for authentication)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const grievances = pgTable("grievances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  userType: text("user_type").notNull(),
  category: text("category").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  priority: text("priority").default("medium"),
  status: text("status").default("submitted"),
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  chatHistory: jsonb("chat_history").$type<any[]>().default([]),
});

export const grievanceCategories = pgTable("grievance_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userType: text("user_type").notNull(),
  isActive: boolean("is_active").default(true),
});

export const chatQuestions = pgTable("chat_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  step: integer("step").notNull(),
  category: text("category"),
  userType: text("user_type").notNull(),
  isActive: boolean("is_active").default(true),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
});

export const insertGrievanceSchema = createInsertSchema(grievances).pick({
  userId: true,
  userType: true,
  category: true,
  subject: true,
  description: true,
  location: true,
  priority: true,
});

export const insertCategorySchema = createInsertSchema(grievanceCategories).pick({
  name: true,
  userType: true,
});

export const insertChatQuestionSchema = createInsertSchema(chatQuestions).pick({
  question: true,
  step: true,
  category: true,
  userType: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).pick({
  key: true,
  value: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGrievance = z.infer<typeof insertGrievanceSchema>;
export type Grievance = typeof grievances.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof grievanceCategories.$inferSelect;
export type InsertChatQuestion = z.infer<typeof insertChatQuestionSchema>;
export type ChatQuestion = typeof chatQuestions.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
