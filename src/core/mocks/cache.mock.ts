import { ICacheService } from '../cache/cache-service.interface';

export class MockCacheService implements ICacheService {
  private storage = new Map<string, any>();
  private locks = new Set<string>();

  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) || null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.storage.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async lock(key: string, ttl: number): Promise<boolean> {
    if (this.locks.has(key)) return false;
    this.locks.add(key);
    return true;
  }

  async unlock(key: string): Promise<void> {
    this.locks.delete(key);
  }
}
