import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BookingService } from './services/booking.service';

@Processor('booking-queue')
export class BookingProcessor extends WorkerHost {
  constructor(private readonly bookingService: BookingService) {
    super();
  }

  async process(
    job: Job<
      { resourceName: string; userId: string; quantity: number },
      any,
      string
    >,
  ): Promise<any> {
    const { resourceName, userId, quantity } = job.data;
    console.log(`[Queue] Procesando reserva: ${resourceName} para ${userId}`);

    try {
      const result = await this.bookingService.createBooking(
        resourceName,
        userId,
        quantity,
      );
      console.log(`[Queue] Reserva EXITOSA: ${job.id}`);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Queue] Reserva FALLIDA: ${job.id} - ${message}`);
      throw new Error(message);
    }
  }
}
