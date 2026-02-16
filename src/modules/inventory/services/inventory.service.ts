import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) { }

  async initializeStock(resourceName: string, totalStock: number): Promise<Inventory> {
    const existing = await this.inventoryRepository.findByResourceName(resourceName);
    if (existing) {
      throw new ConflictException(`Resource ${resourceName} already initialized`);
    }

    const inventory = new Inventory();
    inventory.resourceName = resourceName;
    inventory.total_stock = totalStock;
    inventory.available_stock = totalStock;

    return this.inventoryRepository.save(inventory);
  }

  async getBalance(resourceName: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findByResourceName(resourceName);
    if (!inventory) {
      throw new NotFoundException(`Resource ${resourceName} not found`);
    }
    return inventory;
  }
}
