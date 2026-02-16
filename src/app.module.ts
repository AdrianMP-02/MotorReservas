import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CoreModule } from './core/core.module';
import { BookingModule } from './modules/booking/booking.module';

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
        password: configService.get<string>(
          'DATABASE_PASSWORD',
          'booking_pass',
        ),
        database: configService.get<string>('DATABASE_NAME', 'booking_db'),
        autoLoadEntities: true,
        synchronize: true, // During Phase 4 development, we'll shift to migrations later
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    InventoryModule,
    CoreModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
