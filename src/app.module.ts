import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 3306),
        username: configService.get<string>('DATABASE_USER', 'booking_user'),
        password: configService.get<string>('DATABASE_PASSWORD', 'booking_pass'),
        database: configService.get<string>('DATABASE_NAME', 'booking_db'),
        autoLoadEntities: true,
        synchronize: true, // During Phase 4 development, we'll shift to migrations later
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
