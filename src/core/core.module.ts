import { Module, Global } from '@nestjs/common';
import { ICacheService } from './cache/cache-service.interface';
import { RedisCacheService } from './cache/redis-cache.service';

@Global()
@Module({
  providers: [
    {
      provide: ICacheService,
      useClass: RedisCacheService,
    },
  ],
  exports: [ICacheService],
})
export class CoreModule { }
