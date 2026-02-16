export interface IRepository<T> {
  findOne(id: string | number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string | number): Promise<void>;

  /**
   * Execute logic within a database transaction.
   * Crucial for atomic inventory updates.
   */
  transaction<R>(work: (repo: this) => Promise<R>): Promise<R>;
}

export const IRepository = Symbol('IRepository');
