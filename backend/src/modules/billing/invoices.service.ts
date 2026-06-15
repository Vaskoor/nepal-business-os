import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
  ) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.invoice.findMany({
      where: { businessId },
      include: { items: { include: { product: true } }, customer: true },
    });
  }

  async findOne(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, businessId },
      include: { items: { include: { product: true } }, customer: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const { items, customerId, ...invoiceData } = data;

    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          ...invoiceData,
          businessId,
          customerId,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.quantity * item.price,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const arAccount = await tx.account.findFirst({ where: { businessId, code: '1020' } });
      const revenueAccount = await tx.account.findFirst({ where: { businessId, code: '4010' } });
      if (!arAccount || !revenueAccount) throw new BadRequestException('Accounting accounts not configured');

      await this.accounting.createJournalEntry({
        date: new Date(),
        description: `Invoice #${invoice.invoiceNo}`,
        reference: invoice.id,
        lines: [
          { accountId: arAccount.id, type: 'DEBIT', amount: invoice.grandTotal.toNumber() },
          { accountId: revenueAccount.id, type: 'CREDIT', amount: invoice.grandTotal.toNumber() },
        ],
      });

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) continue;
        const cogsAmount = product.cost.toNumber() * item.quantity;
        const cogsAccount = await tx.account.findFirst({ where: { businessId, code: '5010' } });
        const inventoryAccount = await tx.account.findFirst({ where: { businessId, code: '1020' } });
        if (cogsAccount && inventoryAccount) {
          await this.accounting.createJournalEntry({
            date: new Date(),
            description: `COGS for Invoice #${invoice.invoiceNo}`,
            reference: invoice.id,
            lines: [
              { accountId: cogsAccount.id, type: 'DEBIT', amount: cogsAmount },
              { accountId: inventoryAccount.id, type: 'CREDIT', amount: cogsAmount },
            ],
          });
        }
      }

      return invoice;
    });
  }

  async updateStatus(id: string, status: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const invoice = await this.prisma.invoice.findFirst({ where: { id, businessId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    // Optionally add accounting entry for payment received
    return this.prisma.invoice.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.invoice.delete({ where: { id, businessId } });
  }
}
