import { type ContentItem, type InsertContentItem } from "@shared/schema";
import { randomUUID } from "crypto";

// User types for the storage interface
export interface User {
  id: string;
  username: string;
}

export interface InsertUser {
  username: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getContentItems(): Promise<ContentItem[]>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: string, item: Partial<InsertContentItem>): Promise<ContentItem | undefined>;
  deleteContentItem(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contentItems: Map<string, ContentItem>;

  constructor() {
    this.users = new Map();
    this.contentItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getContentItems(): Promise<ContentItem[]> {
    return Array.from(this.contentItems.values()).sort(
      (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    return this.contentItems.get(id);
  }

  async createContentItem(insertItem: InsertContentItem): Promise<ContentItem> {
    const id = randomUUID();
    const now = new Date();
    const item: ContentItem = {
      ...insertItem,
      description: insertItem.description || null,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.contentItems.set(id, item);
    return item;
  }

  async updateContentItem(id: string, updateData: Partial<InsertContentItem>): Promise<ContentItem | undefined> {
    const existing = this.contentItems.get(id);
    if (!existing) return undefined;

    const updated: ContentItem = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.contentItems.set(id, updated);
    return updated;
  }

  async deleteContentItem(id: string): Promise<boolean> {
    return this.contentItems.delete(id);
  }
}

export const storage = new MemStorage();
