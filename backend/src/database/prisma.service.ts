import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsyncLocalStorage } from 'async_hooks';

export const TENANT_CONTEXT = new AsyncLocalStorage<{ businessId: string }>();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      const modelsWithBusinessId = ['Customer', 'Product', 'Category', 'Invoice', 'Account', 'JournalEntry', 'Purchase', 'Expense', 'Employee', 'PayrollRun', 'Supplier'];
      const context = TENANT_CONTEXT.getStore();
      const businessId = context?.businessId;

      if (businessId && params.model && modelsWithBusinessId.includes(params.model)) {
        // For find operations
        if (params.action === 'findUnique' || params.action === 'findFirst' || params.action === 'findMany') {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};
          params.args.where.businessId = businessId;
        }
        // For create operations
        else if (params.action === 'create') {
          if (!params.args.data) params.args.data = {};
          params.args.data.businessId = businessId;
        }
        // For update operations
        else if (params.action === 'update') {
          if (!params.args.where) params.args.where = {};
          params.args.where.businessId = businessId;
          // Ensure we don't override businessId in data
          if (params.args.data && typeof params.args.data === 'object') {
            delete params.args.data.businessId;
          }
        }
        // For delete operations
        else if (params.action === 'delete' || params.action === 'deleteMany') {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};
          params.args.where.businessId = businessId;
        }
        // For updateMany, upsert, etc.
        else if (params.action === 'updateMany') {
          if (!params.args) params.args = {};
          if (!params.args.where) params.args.where = {};
          params.args.where.businessId = businessId;
          if (params.args.data && typeof params.args.data === 'object') {
            delete params.args.data.businessId;
          }
        }
        else if (params.action === 'upsert') {
          if (!params.args.where) params.args.where = {};
          params.args.where.businessId = businessId;
          if (params.args.create && typeof params.args.create === 'object') {
            params.args.create.businessId = businessId;
          }
          if (params.args.update && typeof params.args.update === 'object') {
            delete params.args.update.businessId;
          }
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
