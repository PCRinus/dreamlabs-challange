import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResolver } from './invoice.resolver';
import { DbService } from '../db/db.service';

@Module({
  providers: [InvoiceResolver, InvoiceService, DbService],
})
export class InvoiceModule {}
