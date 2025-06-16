import {
  users, grievances, grievanceCategories, chatQuestions, systemSettings,
  type User, type InsertUser, type Grievance, type InsertGrievance,
  type Category, type InsertCategory, type ChatQuestion, type InsertChatQuestion,
  type SystemSetting, type InsertSystemSetting
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Grievance management
  createGrievance(grievance: InsertGrievance): Promise<Grievance>;
  getGrievance(id: number): Promise<Grievance | undefined>;
  getGrievancesByUser(userId: number): Promise<Grievance[]>;
  getAllGrievances(): Promise<Grievance[]>;
  updateGrievance(id: number, updates: Partial<Grievance>): Promise<Grievance | undefined>;

  // Categories
  getCategories(userType?: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined>;

  // Chat questions
  getChatQuestions(userType: string, step?: number): Promise<ChatQuestion[]>;
  createChatQuestion(question: InsertChatQuestion): Promise<ChatQuestion>;
  updateChatQuestion(id: number, updates: Partial<ChatQuestion>): Promise<ChatQuestion | undefined>;

  // System settings
  getSetting(key: string): Promise<SystemSetting | undefined>;
  getSettings(category?: string): Promise<SystemSetting[]>;
  setSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createGrievance(insertGrievance: InsertGrievance): Promise<Grievance> {
    const [grievance] = await db
      .insert(grievances)
      .values({
        ...insertGrievance,
        location: insertGrievance.location || null,
        priority: insertGrievance.priority || "medium",
        status: "submitted",
        assignedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatHistory: []
      })
      .returning();
    return grievance;
  }

  async getGrievance(id: number): Promise<Grievance | undefined> {
    const [grievance] = await db.select().from(grievances).where(eq(grievances.id, id));
    return grievance || undefined;
  }

  async getGrievancesByUser(userId: number): Promise<Grievance[]> {
    return await db.select().from(grievances).where(eq(grievances.userId, userId));
  }

  async getAllGrievances(): Promise<Grievance[]> {
    return await db.select().from(grievances);
  }

  async updateGrievance(id: number, updates: Partial<Grievance>): Promise<Grievance | undefined> {
    const [grievance] = await db
      .update(grievances)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(grievances.id, id))
      .returning();
    return grievance || undefined;
  }

  async getCategories(userType?: string): Promise<Category[]> {
    if (userType) {
      return await db.select().from(grievanceCategories)
        .where(eq(grievanceCategories.userType, userType));
    }
    return await db.select().from(grievanceCategories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(grievanceCategories)
      .values({
        ...insertCategory,
        isActive: true
      })
      .returning();
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const [category] = await db
      .update(grievanceCategories)
      .set(updates)
      .where(eq(grievanceCategories.id, id))
      .returning();
    return category || undefined;
  }

  async getChatQuestions(userType: string, step?: number): Promise<ChatQuestion[]> {
    if (step !== undefined) {
      return await db.select().from(chatQuestions)
        .where(and(eq(chatQuestions.userType, userType), eq(chatQuestions.step, step)));
    }
    
    return await db.select().from(chatQuestions)
      .where(eq(chatQuestions.userType, userType));
  }

  async createChatQuestion(insertQuestion: InsertChatQuestion): Promise<ChatQuestion> {
    const [question] = await db
      .insert(chatQuestions)
      .values({
        ...insertQuestion,
        category: insertQuestion.category || null,
        isActive: true
      })
      .returning();
    return question;
  }

  async updateChatQuestion(id: number, updates: Partial<ChatQuestion>): Promise<ChatQuestion | undefined> {
    const [question] = await db
      .update(chatQuestions)
      .set(updates)
      .where(eq(chatQuestions.id, id))
      .returning();
    return question || undefined;
  }

  async getSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting || undefined;
  }

  async getSettings(category?: string): Promise<SystemSetting[]> {
    if (category) {
      return await db.select().from(systemSettings).where(eq(systemSettings.category, category));
    }
    return await db.select().from(systemSettings);
  }

  async setSetting(insertSetting: InsertSystemSetting): Promise<SystemSetting> {
    const [setting] = await db
      .insert(systemSettings)
      .values(insertSetting)
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: insertSetting.value,
          category: insertSetting.category
        }
      })
      .returning();
    return setting;
  }
}

export const storage = new DatabaseStorage();