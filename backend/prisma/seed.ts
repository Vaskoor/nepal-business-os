import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedAccounts } from './seed-accounts';

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { pan: '123456789' },
    update: {},
    create: { name: 'Demo Business', pan: '123456789', address: 'Kathmandu' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Admin User',
      role: 'ADMIN',
      businessId: business.id,
    },
  });

  await seedAccounts(business.id);
  console.log('Seed completed');
}
main().catch(console.error);
