import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('init')
  async initialize(@Body() body: { resourceName: string; totalStock: number }) {
    return this.inventoryService.initializeStock(
      body.resourceName,
      body.totalStock,
    );
  }

  @Get(':resourceName')
  async getBalance(@Param('resourceName') resourceName: string) {
    return this.inventoryService.getBalance(resourceName);
  }
}
