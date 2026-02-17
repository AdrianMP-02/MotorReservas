/* eslint-disable @typescript-eslint/no-unused-vars */
import { IRepository } from '../database/repository.interface';

export class MockRepository<T> implements IRepository<T> {
  protected entities: T[] = [];

  findOne(_: string | number): Promise<T | null> {
    // Basic mock implementation, would normally check an 'id' property
    const entity = this.entities[0] as T | undefined;
    return Promise.resolve(entity || null);
  }

  findAll(): Promise<T[]> {
    return Promise.resolve(this.entities);
  }

  save(entity: T): Promise<T> {
    this.entities.push(entity);
    return Promise.resolve(entity);
  }

  delete(_: string | number): Promise<void> {
    this.entities.pop();
    return Promise.resolve();
  }

  async transaction<R>(work: (repo: this) => Promise<R>): Promise<R> {
    // In memory mock transaction just executes the work
    return await work(this);
  }
}
