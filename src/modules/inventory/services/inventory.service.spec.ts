import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from '../repositories/inventory.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Inventory } from '../entities/inventory.entity';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: jest.Mocked<InventoryRepository>;

  beforeEach(async () => {
    // Create a mock repository using jest functions
    const mockRepository = {
      findByResourceName: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get(InventoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeStock', () => {
    it('should create new inventory if it does not exist', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const totalStock = 10;

      repository.findByResourceName.mockResolvedValue(null);
      repository.save.mockImplementation(async (entity: any) => entity as Inventory);

      // Act
      const result = await service.initializeStock(resourceName, totalStock);

      // Assert
      expect(repository.findByResourceName).toHaveBeenCalledWith(resourceName);
      expect(repository.save).toHaveBeenCalled();
      expect(result.resourceName).toEqual(resourceName);
      expect(result.total_stock).toEqual(totalStock);
      expect(result.available_stock).toEqual(totalStock);
    });

    it('should throw ConflictException if inventory already exists', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const existingInventory = new Inventory();
      existingInventory.resourceName = resourceName;

      repository.findByResourceName.mockResolvedValue(existingInventory);

      // Act & Assert
      await expect(service.initializeStock(resourceName, 5)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('getBalance', () => {
    it('should return inventory balance if it exists', async () => {
      // Arrange
      const resourceName = 'Habitacion_Suite_101';
      const existingInventory = new Inventory();
      existingInventory.resourceName = resourceName;
      existingInventory.available_stock = 3;

      repository.findByResourceName.mockResolvedValue(existingInventory);

      // Act
      const result = await service.getBalance(resourceName);

      // Assert
      expect(repository.findByResourceName).toHaveBeenCalledWith(resourceName);
      expect(result).toEqual(existingInventory);
    });

    it('should throw NotFoundException if inventory does not exist', async () => {
      // Arrange
      const resourceName = 'Non_Existent_Resource';
      repository.findByResourceName.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getBalance(resourceName)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
