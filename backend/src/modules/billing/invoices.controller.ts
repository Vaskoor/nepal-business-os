import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}
  @Get() findAll() { return this.invoicesService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.invoicesService.findOne(id); }
  @Post() create(@Body() data: any) { return this.invoicesService.create(data); }
  @Patch(':id') updateStatus(@Param('id') id: string, @Body('status') status: string) { return this.invoicesService.updateStatus(id, status); }
  @Delete(':id') remove(@Param('id') id: string) { return this.invoicesService.remove(id); }
}
