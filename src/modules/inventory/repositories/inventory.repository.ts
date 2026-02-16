import { Repository, DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IRepository } from '../../../core/database/repository.interface';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InventoryRepository implements IRepository<Inventory> {
  private readonly repository: Repository<Inventory>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly manager?: EntityManager,
  ) {
    this.repository = this.manager
      ? this.manager.getRepository(Inventory)
      : this.dataSource.getRepository(Inventory);
  }

  async findOne(id: string): Promise<Inventory | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByResourceName(resourceName: string): Promise<Inventory | null> {
    return this.repository.findOne({ where: { resourceName } });
  }

  async findAll(): Promise<Inventory[]> {
    return this.repository.find();
  }

  async save(entity: Inventory): Promise<Inventory> {
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async transaction<R>(work: (repo: this) => Promise<R>): Promise<R> {
    return this.dataSource.transaction(async (manager) => {
      const scopedRepo = new InventoryRepository(this.dataSource, manager) as any;
      return await work(scopedRepo);
    });
  }
}
