import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalSales, totalPurchases, totalExpenses, lowStockCount] = await Promise.all([
      this.prisma.invoice.aggregate({
        where: { businessId, date: { gte: startOfMonth } },
        _sum: { grandTotal: true },
      }),
      this.prisma.purchase.aggregate({
        where: { businessId, date: { gte: startOfMonth } },
        _sum: { total: true },
      }),
      this.prisma.expense.aggregate({
        where: { businessId, date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      this.prisma.product.count({
        where: { businessId, stock: { lt: 10 } },
      }),
    ]);

    const sales = totalSales._sum.grandTotal?.toNumber() || 0;
    const purchases = totalPurchases._sum.total?.toNumber() || 0;
    const expenses = totalExpenses._sum.amount?.toNumber() || 0;

    return {
      sales,
      purchases,
      expenses,
      profit: sales - (purchases + expenses),
      lowStockCount,
    };
  }

  async getLowStock() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.findMany({
      where: { businessId, stock: { lt: 10 } },
      select: { name: true, sku: true, stock: true },
    });
  }
}
