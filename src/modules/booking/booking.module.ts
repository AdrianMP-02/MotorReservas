import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { BookingRepository } from './repositories/booking.repository';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), InventoryModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService, BookingRepository],
})
export class BookingModule {}
