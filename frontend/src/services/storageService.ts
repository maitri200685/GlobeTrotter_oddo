/**
 * Safe local storage abstraction with JSON serialization and memory fallback
 */
class StorageService {
  private memoryFallback: Map<string, string> = new Map();

  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to read key "${key}" from localStorage:`, error);
      const fallbackItem = this.memoryFallback.get(key);
      if (fallbackItem) {
        try {
          return JSON.parse(fallbackItem) as T;
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialized);
      }
      this.memoryFallback.set(key, serialized);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to save key "${key}" to localStorage:`, error);
      this.memoryFallback.set(key, JSON.stringify(value));
      return false;
    }
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      this.memoryFallback.delete(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      this.memoryFallback.clear();
    } catch (error) {
      console.warn('[StorageService] Failed to clear storage:', error);
    }
  }
}

export const storageService = new StorageService();
