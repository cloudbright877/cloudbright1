/**
 * LocalStorageAdapter - localStorage implementation of StorageAdapter
 *
 * Stores data in browser localStorage with JSON serialization.
 * Each key maps to an array of items in localStorage.
 */

import type { StorageAdapter, Filter } from './StorageAdapter';

export class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get all items for a key from localStorage
   */
  private getAll<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(key);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error(`[LocalStorageAdapter] Failed to parse ${key}:`, error);
      return [];
    }
  }

  /**
   * Save all items for a key to localStorage
   */
  private saveAll<T>(key: string, items: T[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`[LocalStorageAdapter] Failed to save ${key}:`, error);
      throw error;
    }
  }

  /**
   * Match an item against a filter
   */
  private matchesFilter<T extends Record<string, any>>(item: T, filter: Filter): boolean {
    return Object.entries(filter).every(([key, value]) => {
      if (value === undefined) return true;
      return item[key] === value;
    });
  }

  async get<T extends { id: string }>(key: string, id: string): Promise<T | null> {
    const items = this.getAll<T>(key);
    return items.find(item => item.id === id) || null;
  }

  async list<T>(key: string, filter?: Filter): Promise<T[]> {
    const items = this.getAll<T>(key);

    if (!filter) return items;

    return items.filter(item => this.matchesFilter(item as any, filter));
  }

  async create<T extends { id: string }>(key: string, data: T): Promise<T> {
    const items = this.getAll<T>(key);

    // Check for duplicate ID
    if (items.some(item => item.id === data.id)) {
      throw new Error(`[LocalStorageAdapter] Item with id '${data.id}' already exists in '${key}'`);
    }

    items.push(data);
    this.saveAll(key, items);

    return data;
  }

  async update<T extends { id: string }>(key: string, id: string, data: Partial<T>): Promise<T> {
    const items = this.getAll<T>(key);
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      throw new Error(`[LocalStorageAdapter] Item with id '${id}' not found in '${key}'`);
    }

    // Merge with existing data
    items[index] = { ...items[index], ...data };
    this.saveAll(key, items);

    return items[index];
  }

  async delete(key: string, id: string): Promise<void> {
    const items = this.getAll<{ id: string }>(key);
    const filtered = items.filter(item => item.id !== id);

    if (filtered.length === items.length) {
      throw new Error(`[LocalStorageAdapter] Item with id '${id}' not found in '${key}'`);
    }

    this.saveAll(key, filtered);
  }

  async exists(key: string, id: string): Promise<boolean> {
    const items = this.getAll<{ id: string }>(key);
    return items.some(item => item.id === id);
  }

  async findOne<T>(key: string, filter: Filter): Promise<T | null> {
    const items = this.getAll<T>(key);
    return items.find(item => this.matchesFilter(item as any, filter)) || null;
  }

  /**
   * Clear all data for a key
   */
  async clear(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

// Singleton instance
export const storage = new LocalStorageAdapter();
