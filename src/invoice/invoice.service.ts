import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Invoice } from '@prisma/client';

export type SelectionFilters = Pick<Invoice, 'type' | 'currency' | 'customerId' | 'projectId'>;

@Injectable()
export class InvoiceService {
  constructor(private readonly dbService: DbService) {}

  async selectInvoiceById(id: number): Promise<Invoice> {
    return await this.dbService.invoice.findUnique({
      where: { id },
    });
  }

  async selectInvoices(invoiceFIlters: SelectionFilters): Promise<Invoice[]> {
    const { currency, customerId, projectId, type } = invoiceFIlters;

    return await this.dbService.invoice.findMany({
      where: {
        currency,
        customerId,
        projectId,
        type,
      },
    });
  }
}
