import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.findMany({ where: { businessId } });
  }
  async findOne(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.findFirst({ where: { id, businessId } });
  }
  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.create({ data: { ...data, businessId } });
  }
  async update(id: string, data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.update({ where: { id, businessId }, data });
  }
  async remove(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.product.delete({ where: { id, businessId } });
  }
}
