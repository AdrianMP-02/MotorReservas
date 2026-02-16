export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;

  /**
   * Acquires a distributed lock.
   * @param key The lock key
   * @param ttl Time to live in milliseconds
   * @returns true if lock acquired, false otherwise
   */
  lock(key: string, ttl: number): Promise<boolean>;

  /**
   * Releases a distributed lock.
   * @param key The lock key
   */
  unlock(key: string): Promise<void>;
}

export const ICacheService = Symbol('ICacheService');
