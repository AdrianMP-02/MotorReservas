import { Injectable, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createBooking(
    resourceName: string,
    userId: string,
    quantity: number,
  ): Promise<Booking> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Stock Check & Lock (Implicitly handled by transaction or explicit lock if needed)
      // For now, we rely on the DB transaction and the DistributedLock decorator at controller level.

      const inventoryRepo = manager.getRepository(Inventory);
      const bookingRepo = manager.getRepository(Booking);

      const inventory = await inventoryRepo.findOne({
        where: { resourceName },
        lock: { mode: 'pessimistic_write' }, // Double-lock at DB level
      });

      if (!inventory) {
        throw new ConflictException(`Resource ${resourceName} not found`);
      }

      if (inventory.available_stock < quantity) {
        throw new ConflictException(
          `Not enough stock for ${resourceName}. Requested: ${quantity}, Available: ${inventory.available_stock}`,
        );
      }

      // 2. Decrease Stock
      inventory.available_stock -= quantity;
      await inventoryRepo.save(inventory);

      // 3. Create Booking
      const booking = new Booking();
      booking.inventoryId = inventory.id;
      booking.userId = userId;
      booking.quantity = quantity;
      booking.status = BookingStatus.CONFIRMED;

      return await bookingRepo.save(booking);
    });
  }
}
