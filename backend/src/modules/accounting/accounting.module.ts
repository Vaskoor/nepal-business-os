import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountsController } from './accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}
