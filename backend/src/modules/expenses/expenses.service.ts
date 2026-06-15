import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';
import { AccountingService } from '../accounting/accounting.service';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    private accounting: AccountingService,
  ) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.expense.findMany({ where: { businessId } });
  }

  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const expense = await this.prisma.expense.create({
      data: { ...data, businessId },
    });

    // Get expense account (e.g., 5020 Rent Expense)
    const expenseAccount = await this.prisma.account.findFirst({
      where: { businessId, code: '5020' }, // adjust as needed, or use data.accountId
    });
    const cashAccount = await this.prisma.account.findFirst({
      where: { businessId, code: '1010' },
    });
    if (!expenseAccount || !cashAccount) {
      throw new BadRequestException('Required accounts not found');
    }

    await this.accounting.createJournalEntry({
      date: new Date(),
      description: `Expense: ${data.category}`,
      reference: expense.id,
      lines: [
        { accountId: expenseAccount.id, type: 'DEBIT', amount: data.amount },
        { accountId: cashAccount.id, type: 'CREDIT', amount: data.amount },
      ],
    });

    return expense;
  }
}
