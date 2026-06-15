import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async salesSummary() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const invoices = await this.prisma.invoice.findMany({
      where: { businessId },
      select: { total: true, date: true },
    });
    const totalSales = invoices.reduce((sum, inv) => sum + inv.total.toNumber(), 0);
    return { totalSales, invoiceCount: invoices.length };
  }
}
