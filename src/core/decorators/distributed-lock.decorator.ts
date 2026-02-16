import { SetMetadata, applyDecorators, UseInterceptors } from '@nestjs/common';
import { DistributedLockInterceptor } from '../interceptors/distributed-lock.interceptor';

export const LOCK_KEY = 'distributed_lock_key';

/**
 * Decorator to protect a method with a distributed lock.
 * @param resourceKey The key to lock (can use method arguments placeholder eventually)
 * @param ttl Time to live in ms
 */
export function DistributedLock(resourceKey: string, ttl: number = 5000) {
  return applyDecorators(
    SetMetadata(LOCK_KEY, { resourceKey, ttl }),
    UseInterceptors(DistributedLockInterceptor),
  );
}
