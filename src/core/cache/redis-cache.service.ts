import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICacheService } from './cache-service.interface';

@Injectable()
export class RedisCacheService implements ICacheService, OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, data, 'PX', ttl);
    } else {
      await this.redisClient.set(key, data);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async lock(key: string, ttl: number): Promise<boolean> {
    const lockKey = `lock:${key}`;
    // SET resource_name my_random_value NX PX 30000
    // Simplified: we just use 'locked' as value for now
    const result = await this.redisClient.set(lockKey, 'locked', 'PX', ttl, 'NX');
    return result === 'OK';
  }

  async unlock(key: string): Promise<void> {
    const lockKey = `lock:${key}`;
    await this.redisClient.del(lockKey);
  }
}
