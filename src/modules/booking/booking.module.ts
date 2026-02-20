import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/booking.repository';
import { InventoryModule } from '../inventory/inventory.module';
import { BullModule } from '@nestjs/bullmq';
import { BookingProcessor } from './booking.processor';

import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    InventoryModule,
    BullModule.registerQueue({
      name: 'booking-queue',
    }),
    BullBoardModule.forFeature({
      name: 'booking-queue',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, BookingProcessor],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
