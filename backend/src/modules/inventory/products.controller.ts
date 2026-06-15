import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get() findAll() { return this.productsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.productsService.findOne(id); }
  @Post() create(@Body() data: any) { return this.productsService.create(data); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: any) { return this.productsService.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.productsService.remove(id); }
}
