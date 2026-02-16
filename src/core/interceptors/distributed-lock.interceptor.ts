import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ICacheService } from '../cache/cache-service.interface';
import { LOCK_KEY } from '../decorators/distributed-lock.decorator';

@Injectable()
export class DistributedLockInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ICacheService)
    private readonly cacheService: ICacheService,
  ) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<{ resourceKey: string; ttl: number }>(
      LOCK_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const { resourceKey, ttl } = options;

    // Simple implementation: extraction from params if it starts with :
    let actualKey = resourceKey;
    if (resourceKey.startsWith(':')) {
      const paramName = resourceKey.substring(1);
      const request = context.switchToHttp().getRequest();
      actualKey = request.params[paramName] || request.body[paramName] || resourceKey;
    }

    const acquired = await this.cacheService.lock(actualKey, ttl);
    if (!acquired) {
      throw new ConflictException(`Resource ${actualKey} is currently locked`);
    }

    return next.handle().pipe(
      finalize(async () => {
        await this.cacheService.unlock(actualKey);
      }),
    );
  }
}
