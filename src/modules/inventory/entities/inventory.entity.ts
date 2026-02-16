import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'resource_name', unique: true })
  resourceName: string;

  @Column({ type: 'int', default: 0 })
  total_stock: number;

  @Column({ type: 'int', default: 0 })
  available_stock: number;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
