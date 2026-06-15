import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get('low-stock')
  getLowStock() {
    return this.service.getLowStock();
  }
}
