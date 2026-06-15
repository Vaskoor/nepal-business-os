import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.account.findMany({ where: { businessId } });
  }
}
