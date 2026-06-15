import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.employee.findMany({ where: { businessId } });
  }

  async findOne(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const employee = await this.prisma.employee.findFirst({ where: { id, businessId } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async create(data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.employee.create({ data: { ...data, businessId } });
  }

  async update(id: string, data: any) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.employee.update({ where: { id, businessId }, data });
  }

  async remove(id: string) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.employee.delete({ where: { id, businessId } });
  }
}
