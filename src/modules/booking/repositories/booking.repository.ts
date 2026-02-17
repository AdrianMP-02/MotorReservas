import { Repository, DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IRepository } from '../../../core/database/repository.interface';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class BookingRepository implements IRepository<Booking> {
  private readonly repository: Repository<Booking>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly manager?: EntityManager,
  ) {
    this.repository = this.manager
      ? this.manager.getRepository(Booking)
      : this.dataSource.getRepository(Booking);
  }

  async findOne(id: string): Promise<Booking | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Booking[]> {
    return this.repository.find();
  }

  async save(entity: Booking): Promise<Booking> {
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async transaction<R>(work: (repo: this) => Promise<R>): Promise<R> {
    return this.dataSource.transaction(async (manager) => {
      const scopedRepo = new BookingRepository(
        this.dataSource,
        manager,
      ) as this;
      return await work(scopedRepo);
    });
  }
}
