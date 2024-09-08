import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../invoice.service';
import { Invoice, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { DbService } from '../../db/db.service';
import { CreateInvoiceInput } from '../dto/create-invoice.input';

describe(InvoiceService.name, () => {
  let invoiceService: InvoiceService;
  let dbMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    dbMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceService, { provide: DbService, useValue: dbMock }],
    }).compile();

    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  describe(InvoiceService.prototype.selectInvoiceById.name, () => {
    it('should return an invoice by id', async () => {
      const mockInvoice = { id: 1 } as Invoice;
      dbMock.invoice.findUnique.mockResolvedValue(mockInvoice);

      const invoice = await invoiceService.selectInvoiceById(1);

      expect(invoice).toEqual(mockInvoice);
      expect(dbMock.invoice.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if invoice is not found', async () => {
      dbMock.invoice.findUnique.mockResolvedValueOnce(null);

      const invoice = await invoiceService.selectInvoiceById(1);

      expect(invoice).toBeNull();
    });
  });

  describe(InvoiceService.prototype.selectInvoices.name, () => {
    const mockSelectionFilters = {
      currency: 'EUR',
      customerId: 'mockCustomerId',
      projectId: 'mockProjectId',
      type: 'INVOICE',
    } as const;

    it('should return invoices by filters', async () => {
      const mockInvoices = [{ id: 1 }, { id: 2 }] as Invoice[];
      dbMock.invoice.findMany.mockResolvedValue(mockInvoices);

      const invoices = await invoiceService.selectInvoices(mockSelectionFilters);

      expect(invoices).toEqual(mockInvoices);
      expect(dbMock.invoice.findMany).toHaveBeenCalledWith({ where: mockSelectionFilters });
    });
  });

  describe(InvoiceService.prototype.createInvoice.name, () => {
    const mockCreateInvoiceInput: CreateInvoiceInput = {
      amount: 100,
      currency: 'EUR',
      description: 'Test invoice',
      dueDate: new Date('2025-01-01'),
      type: 'INVOICE',
      customerId: 'mockCustomerId',
    } as const;

    it('should create an invoice', async () => {
      const mockInvoice = { id: 1, ...mockCreateInvoiceInput };
      dbMock.invoice.create.mockResolvedValue(mockInvoice as Invoice);

      const invoice = await invoiceService.createInvoice(mockCreateInvoiceInput);

      expect(invoice).toEqual(mockInvoice);
      expect(dbMock.invoice.create).toHaveBeenCalledWith({ data: mockCreateInvoiceInput });
    });
  });

  describe(InvoiceService.prototype.updateInvoice.name, () => {
    it('should update an invoice', async () => {
      const mockUpdateInvoiceInput = { amount: 200 } as const;
      const mockInvoice = { id: 1 } as Invoice;
      dbMock.invoice.update.mockResolvedValue(mockInvoice);

      const invoice = await invoiceService.updateInvoice(1, mockUpdateInvoiceInput);

      expect(invoice).toEqual(mockInvoice);
      expect(dbMock.invoice.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateInvoiceInput,
      });
    });
  });

  describe(InvoiceService.prototype.markInvoiceAsPaid.name, () => {
    it('should mark an invoice as paid', async () => {
      const mockInvoice = { id: 1 } as Invoice;
      dbMock.invoice.update.mockResolvedValue(mockInvoice);

      const invoice = await invoiceService.markInvoiceAsPaid(1);

      expect(invoice).toEqual(mockInvoice);
      expect(dbMock.invoice.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isPaid: true },
      });
    });
  });

  describe(InvoiceService.prototype.generateStornoInvoice.name, () => {
    it('should generate a storno invoice', async () => {
      const mockExistingInvoice = { id: 1, type: 'INVOICE' } as Invoice;
      const mockStornoInvoice = { id: 2, type: 'STORNO' } as Invoice;
      dbMock.invoice.findUnique.mockResolvedValue(mockExistingInvoice);
      dbMock.invoice.create.mockResolvedValue(mockStornoInvoice);

      const stornoInvoice = await invoiceService.generateStornoInvoice(1);

      expect(stornoInvoice).toEqual(mockStornoInvoice);
      expect(dbMock.invoice.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(dbMock.invoice.create).toHaveBeenCalledWith({
        data: { ...mockExistingInvoice, type: 'STORNO' },
      });
    });

    it('should throw an error if invoice not found', async () => {
      dbMock.invoice.findUnique.mockResolvedValue(null);

      await expect(invoiceService.generateStornoInvoice(1)).rejects.toThrow('Invoice not found');
    });

    it('should throw an error if invoice is already a storno invoice', async () => {
      const mockExistingInvoice = { id: 1, type: 'STORNO' } as Invoice;
      dbMock.invoice.findUnique.mockResolvedValue(mockExistingInvoice);

      await expect(invoiceService.generateStornoInvoice(1)).rejects.toThrow(
        'Invoice is already a storno invoice',
      );
    });
  });
});
