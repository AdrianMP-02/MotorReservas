import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Inventory } from '../modules/inventory/entities/inventory.entity';
import { Booking } from '../modules/booking/entities/booking.entity';

config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'booking_user',
  password: process.env.DATABASE_PASSWORD || 'booking_pass',
  database: process.env.DATABASE_NAME || 'booking_db',
  entities: [Inventory, Booking],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
});
