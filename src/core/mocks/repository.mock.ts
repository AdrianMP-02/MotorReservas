import { IRepository } from '../database/repository.interface';

export class MockRepository<T> implements IRepository<T> {
  protected entities: T[] = [];

  async findOne(id: string | number): Promise<T | null> {
    // Basic mock implementation, would normally check an 'id' property
    return (this.entities[0] as any) || null;
  }

  async findAll(): Promise<T[]> {
    return this.entities;
  }

  async save(entity: T): Promise<T> {
    this.entities.push(entity);
    return entity;
  }

  async delete(id: string | number): Promise<void> {
    this.entities.pop();
  }

  async transaction<R>(work: (repo: this) => Promise<R>): Promise<R> {
    // In memory mock transaction just executes the work
    return await work(this);
  }
}
