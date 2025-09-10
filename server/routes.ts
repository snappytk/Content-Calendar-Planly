import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentItemSchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // PayPal routes (matching blueprint requirements)
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Content Items routes
  app.get("/api/content", async (req, res) => {
    try {
      const items = await storage.getContentItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching content items:", error);
      res.status(500).json({ message: "Failed to fetch content items" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const item = await storage.getContentItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching content item:", error);
      res.status(500).json({ message: "Failed to fetch content item" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const validatedData = insertContentItemSchema.parse(req.body);
      const item = await storage.createContentItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: error });
      }
      console.error("Error creating content item:", error);
      res.status(500).json({ message: "Failed to create content item" });
    }
  });

  app.put("/api/content/:id", async (req, res) => {
    try {
      const validatedData = insertContentItemSchema.partial().parse(req.body);
      const item = await storage.updateContentItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: error });
      }
      console.error("Error updating content item:", error);
      res.status(500).json({ message: "Failed to update content item" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContentItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Content item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content item:", error);
      res.status(500).json({ message: "Failed to delete content item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
