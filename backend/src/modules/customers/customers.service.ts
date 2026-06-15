import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.customer.findMany({ where: { businessId } });
  }

  async findOne(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.customer.findFirst({ where: { id, businessId } });
  }

  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.customer.create({ data: { ...data, businessId } });
  }

  async update(id: string, data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.customer.update({ where: { id, businessId }, data });
  }

  async remove(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.customer.delete({ where: { id, businessId } });
  }
}
