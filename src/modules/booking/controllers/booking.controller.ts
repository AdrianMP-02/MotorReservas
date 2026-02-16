import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { DistributedLock } from '../../../core/decorators/distributed-lock.decorator';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @DistributedLock(':resourceName', 10000) // 10s TTL
  async create(
    @Body() body: { resourceName: string; userId: string; quantity: number },
  ) {
    return this.bookingService.createBooking(
      body.resourceName,
      body.userId,
      body.quantity,
    );
  }
}
