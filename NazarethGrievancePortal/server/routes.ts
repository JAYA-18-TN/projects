import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGrievanceSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // User management routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    const safeUsers = users.map(u => ({ 
      id: u.id, 
      email: u.email, 
      role: u.role, 
      isActive: u.isActive, 
      lastLogin: u.lastLogin 
    }));
    res.json(safeUsers);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        isActive: user.isActive 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      delete updates.password; // Prevent password updates through this route
      
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        isActive: user.isActive 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Grievance routes
  app.get("/api/grievances", async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    let grievances;
    if (userId) {
      grievances = await storage.getGrievancesByUser(userId);
    } else {
      grievances = await storage.getAllGrievances();
    }
    
    res.json(grievances);
  });

  app.post("/api/grievances", async (req, res) => {
    try {
      const grievanceData = insertGrievanceSchema.parse(req.body);
      const grievance = await storage.createGrievance(grievanceData);
      res.json(grievance);
    } catch (error) {
      res.status(400).json({ message: "Invalid grievance data" });
    }
  });

  app.patch("/api/grievances/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const grievance = await storage.updateGrievance(id, updates);
      if (!grievance) {
        return res.status(404).json({ message: "Grievance not found" });
      }
      
      res.json(grievance);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    const userType = req.query.userType as string;
    const categories = await storage.getCategories(userType);
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Chat questions routes
  app.get("/api/chat-questions", async (req, res) => {
    const userType = req.query.userType as string;
    const step = req.query.step ? parseInt(req.query.step as string) : undefined;
    
    const questions = await storage.getChatQuestions(userType, step);
    res.json(questions);
  });

  app.post("/api/chat-questions", async (req, res) => {
    try {
      const question = await storage.createChatQuestion(req.body);
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  app.patch("/api/chat-questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.updateChatQuestion(id, req.body);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // System settings routes
  app.get("/api/settings", async (req, res) => {
    const category = req.query.category as string;
    const settings = await storage.getSettings(category);
    res.json(settings);
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const setting = await storage.setSetting(req.body);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid setting data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
