import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('bookings')
export class BookingController {
  constructor(
    @InjectQueue('booking-queue') private readonly bookingQueue: Queue,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(
    @Body() body: { resourceName: string; userId: string; quantity: number },
  ) {
    const job = await this.bookingQueue.add('create-booking', body, {
      attempts: 1, // No reintentar si falla por stock (regla de negocio)
      removeOnComplete: 1000, // Mantener los últimos 1000 completados en el dashboard
      removeOnFail: 1000, // Mantener los últimos 1000 fallidos
    });

    return {
      message: 'Reserva en proceso',
      jobId: job.id,
    };
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    const job = await this.bookingQueue.getJob(id);

    if (!job) {
      return { status: 'not_found' };
    }

    const state: string = await job.getState();
    const result: unknown = job.returnvalue;
    const reason: string | undefined = job.failedReason;

    return {
      id: job.id,
      status: state,
      result: result || null,
      error: reason || null,
    };
  }
}
