/**
 * StorageAdapter - Abstract interface for storage operations
 *
 * This abstraction layer allows easy migration from localStorage to PostgreSQL
 * without changing the business logic layer.
 */

export interface Filter {
  [key: string]: any;
}

export interface StorageAdapter {
  /**
   * Get a single item by key and ID
   */
  get<T extends { id: string }>(key: string, id: string): Promise<T | null>;

  /**
   * List all items for a given key, optionally filtered
   */
  list<T>(key: string, filter?: Filter): Promise<T[]>;

  /**
   * Create a new item
   */
  create<T extends { id: string }>(key: string, data: T): Promise<T>;

  /**
   * Update an existing item
   */
  update<T extends { id: string }>(key: string, id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete an item
   */
  delete(key: string, id: string): Promise<void>;

  /**
   * Check if an item exists
   */
  exists(key: string, id: string): Promise<boolean>;

  /**
   * Find one item matching filter
   */
  findOne<T>(key: string, filter: Filter): Promise<T | null>;
}
