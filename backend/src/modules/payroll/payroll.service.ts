import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TENANT_CONTEXT } from '../../database/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    return this.prisma.payrollRun.findMany({ where: { businessId } });
  }

  async runPayroll(month: number, year: number) {
    const { businessId } = TENANT_CONTEXT.getStore()!;
    const employees = await this.prisma.employee.findMany({ where: { businessId } });
    const runs = employees.map(emp => ({
      businessId,
      employeeId: emp.id,
      month,
      year,
      grossSalary: emp.salary,
      deductions: 0,
      netSalary: emp.salary,
    }));
    await this.prisma.payrollRun.createMany({ data: runs });
    return { success: true, count: runs.length };
  }
}
