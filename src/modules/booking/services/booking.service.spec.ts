import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { DataSource, EntityManager } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';

describe('BookingService', () => {
  let service: BookingService;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    dataSource = module.get(getDataSourceToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    it('should throw ConflictException if inventory is not found', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const userId = 'user1';
      const quantity = 1;

      const mockInventoryRepo = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockEntityManager = {
        getRepository: jest.fn().mockImplementation((entity) => {
          if (entity === Inventory) return mockInventoryRepo;
          return {};
        }),
      } as unknown as EntityManager;

      dataSource.transaction.mockImplementation(async (cb) => {
        return await cb(mockEntityManager);
      });

      // Act & Assert
      await expect(
        service.createBooking(resourceName, userId, quantity),
      ).rejects.toThrow(ConflictException);
      expect(mockInventoryRepo.findOne).toHaveBeenCalledWith({
        where: { resourceName },
        lock: { mode: 'pessimistic_write' },
      });
    });

    it('should throw ConflictException if not enough stock', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const userId = 'user1';
      const quantity = 5;

      const existingInventory = new Inventory();
      existingInventory.resourceName = resourceName;
      existingInventory.available_stock = 3; // Not enough

      const mockInventoryRepo = {
        findOne: jest.fn().mockResolvedValue(existingInventory),
      };

      const mockEntityManager = {
        getRepository: jest.fn().mockImplementation((entity) => {
          if (entity === Inventory) return mockInventoryRepo;
          return {};
        }),
      } as unknown as EntityManager;

      dataSource.transaction.mockImplementation(async (cb) => {
        return await cb(mockEntityManager);
      });

      // Act & Assert
      await expect(
        service.createBooking(resourceName, userId, quantity),
      ).rejects.toThrow(ConflictException);
    });

    it('should create booking and decrease stock if enough stock is available', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const userId = 'user1';
      const quantity = 2;

      const existingInventory = new Inventory();
      existingInventory.id = 1;
      existingInventory.resourceName = resourceName;
      existingInventory.available_stock = 10;

      const expectedStoredBooking = new Booking();
      expectedStoredBooking.id = 100;
      expectedStoredBooking.inventoryId = existingInventory.id;
      expectedStoredBooking.userId = userId;
      expectedStoredBooking.quantity = quantity;
      expectedStoredBooking.status = BookingStatus.CONFIRMED;

      const mockInventoryRepo = {
        findOne: jest.fn().mockResolvedValue(existingInventory),
        save: jest.fn().mockResolvedValue(true), // We don't really care about the return value here
      };

      const mockBookingRepo = {
        save: jest.fn().mockResolvedValue(expectedStoredBooking),
      };

      const mockEntityManager = {
        getRepository: jest.fn().mockImplementation((entity) => {
          if (entity === Inventory) return mockInventoryRepo;
          if (entity === Booking) return mockBookingRepo;
          return {};
        }),
      } as unknown as EntityManager;

      dataSource.transaction.mockImplementation(async (cb) => {
        return await cb(mockEntityManager);
      });

      // Act
      const result = await service.createBooking(resourceName, userId, quantity);

      // Assert
      expect(mockInventoryRepo.findOne).toHaveBeenCalled();
      expect(mockInventoryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          available_stock: 8, // Stock should be decreased by 2
        })
      );
      expect(mockBookingRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          inventoryId: 1,
          userId: 'user1',
          quantity: 2,
          status: BookingStatus.CONFIRMED
        })
      );
      expect(result).toEqual(expectedStoredBooking);
    });
  });
});
