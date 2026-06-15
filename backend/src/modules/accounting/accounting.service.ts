import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async createJournalEntry(data: { date: Date; description: string; reference?: string; lines: { accountId: string; type: 'DEBIT' | 'CREDIT'; amount: number }[] }) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    let totalDebit = 0, totalCredit = 0;
    for (const line of data.lines) {
      if (line.type === 'DEBIT') totalDebit += line.amount;
      else totalCredit += line.amount;
    }
    if (totalDebit !== totalCredit) throw new Error('Debit and Credit must balance');
    return this.prisma.journalEntry.create({
      data: {
        businessId,
        date: data.date,
        description: data.description,
        reference: data.reference,
        lines: { create: data.lines },
      },
    });
  }
}
