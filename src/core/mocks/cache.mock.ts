/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICacheService } from '../cache/cache-service.interface';

export class MockCacheService implements ICacheService {
  private storage = new Map<string, any>();
  private locks = new Set<string>();

  get<T>(key: string): Promise<T | null> {
    const val = this.storage.get(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return Promise.resolve((val as any) || null);
  }

  set<T>(key: string, value: T, _ttl?: number): Promise<void> {
    this.storage.set(key, value);
    return Promise.resolve();
  }

  del(key: string): Promise<void> {
    this.storage.delete(key);
    return Promise.resolve();
  }

  lock(key: string, _ttl: number): Promise<boolean> {
    if (this.locks.has(key)) return Promise.resolve(false);
    this.locks.add(key);
    return Promise.resolve(true);
  }

  unlock(key: string): Promise<void> {
    this.locks.delete(key);
    return Promise.resolve();
  }
}
