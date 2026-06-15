import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private service: PayrollService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('run')
  runPayroll(@Body() data: { month: number; year: number }) {
    return this.service.runPayroll(data.month, data.year);
  }
}
