import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
  ) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.purchase.findMany({
      where: { businessId },
      include: { items: { include: { product: true } }, supplier: true },
    });
  }

  async findOne(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const purchase = await this.prisma.purchase.findFirst({
      where: { id, businessId },
      include: { items: { include: { product: true } }, supplier: true },
    });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return purchase;
  }

  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const { items, supplierId, ...purchaseData } = data;

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          ...purchaseData,
          businessId,
          supplierId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              total: item.quantity * item.costPrice,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      const inventoryAccount = await tx.account.findFirst({ where: { businessId, code: '1020' } });
      const apAccount = await tx.account.findFirst({ where: { businessId, code: '2010' } });
      if (!inventoryAccount || !apAccount) throw new BadRequestException('Required accounts not found');

      await this.accounting.createJournalEntry({
        date: new Date(),
        description: `Purchase order #${purchase.id}`,
        reference: purchase.id,
        lines: [
          { accountId: inventoryAccount.id, type: 'DEBIT', amount: purchase.total.toNumber() },
          { accountId: apAccount.id, type: 'CREDIT', amount: purchase.total.toNumber() },
        ],
      });

      return purchase;
    });
  }

  async updateStatus(id: string, status: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const purchase = await this.prisma.purchase.findFirst({ where: { id, businessId } });
    if (!purchase) throw new NotFoundException('Purchase not found');
    return this.prisma.purchase.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.purchase.delete({ where: { id, businessId } });
  }
}
