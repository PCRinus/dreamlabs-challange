import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Invoice } from '@prisma/client';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';

export type SelectionFilters = Pick<Invoice, 'type' | 'currency' | 'customerId' | 'projectId'>;

@Injectable()
export class InvoiceService {
  constructor(private readonly dbService: DbService) {}

  async selectInvoiceById(id: number): Promise<Invoice | null> {
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

  async createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
    return await this.dbService.invoice.create({
      data,
    });
  }

  async updateInvoice(id: number, data: UpdateInvoiceInput): Promise<Invoice> {
    return await this.dbService.invoice.update({
      where: { id },
      data,
    });
  }

  async markInvoiceAsPaid(id: number): Promise<Invoice> {
    return await this.dbService.invoice.update({
      where: { id },
      data: { isPaid: true },
    });
  }

  async generateStornoInvoice(id: number): Promise<Invoice> {
    const existingInvoice = await this.dbService.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    if (existingInvoice.type === 'STORNO') {
      throw new Error('Invoice is already a storno invoice');
    }

    return await this.dbService.invoice.create({
      data: { ...existingInvoice, type: 'STORNO' },
    });
  }
}
