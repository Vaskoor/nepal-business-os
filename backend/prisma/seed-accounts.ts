import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedAccounts(businessId: string) {
  const accounts = [
    { code: '1010', name: 'Cash', type: 'ASSET' },
    { code: '1020', name: 'Bank', type: 'ASSET' },
    { code: '2010', name: 'Accounts Payable', type: 'LIABILITY' },
    { code: '3010', name: 'Owner’s Equity', type: 'EQUITY' },
    { code: '4010', name: 'Sales Revenue', type: 'REVENUE' },
    { code: '5010', name: 'Cost of Goods Sold', type: 'EXPENSE' },
    { code: '5020', name: 'Rent Expense', type: 'EXPENSE' },
  ];
  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { businessId_code: { businessId, code: acc.code } },
      update: {},
      create: { ...acc, businessId },
    });
  }
  console.log('Chart of Accounts seeded');
}
