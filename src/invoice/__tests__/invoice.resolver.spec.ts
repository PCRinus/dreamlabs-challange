import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceResolver } from '../invoice.resolver';
import { InvoiceService } from '../invoice.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Invoice } from '@prisma/client';
import { CreateInvoiceInput } from '../dto/create-invoice.input';

describe(InvoiceResolver.name, () => {
  let invoiceResolver: InvoiceResolver;
  let invoiceServiceMock: DeepMockProxy<InvoiceService>;

  beforeEach(async () => {
    invoiceServiceMock = mockDeep<InvoiceService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceResolver, { provide: InvoiceService, useValue: invoiceServiceMock }],
    }).compile();

    invoiceResolver = module.get<InvoiceResolver>(InvoiceResolver);
  });

  describe(InvoiceResolver.prototype.selectInvoiceById.name, () => {
    it('should return an invoice by id', async () => {
      const mockInvoice = { id: 1 } as Invoice;
      invoiceServiceMock.selectInvoiceById.mockResolvedValue(mockInvoice);

      const invoice = await invoiceResolver.selectInvoiceById(1);

      expect(invoice).toEqual(mockInvoice);
      expect(invoiceServiceMock.selectInvoiceById).toHaveBeenCalledWith(1);
    });

    it('should throw an error if invoice is not found', async () => {
      invoiceServiceMock.selectInvoiceById.mockResolvedValue(null);

      await expect(invoiceResolver.selectInvoiceById(1)).rejects.toThrow('Invoice not found: 1');
    });
  });

  describe(InvoiceResolver.prototype.selectInvoices.name, () => {
    const mockSelectionFilters = {
      currency: 'EUR',
      customerId: 'mockCustomerId',
      projectId: 'mockProjectId',
      type: 'INVOICE',
    } as const;

    it('should return invoices by filters', async () => {
      const mockInvoices = [{ id: 1 }, { id: 2 }] as Invoice[];
      invoiceServiceMock.selectInvoices.mockResolvedValue(mockInvoices);

      const invoices = await invoiceResolver.selectInvoices(
        mockSelectionFilters.currency,
        mockSelectionFilters.type,
        mockSelectionFilters.customerId,
        mockSelectionFilters.projectId,
      );

      expect(invoices).toEqual(mockInvoices);
      expect(invoiceServiceMock.selectInvoices).toHaveBeenCalledWith(mockSelectionFilters);
    });
  });

  describe(InvoiceResolver.prototype.createInvoice.name, () => {
    it('should create an invoice', async () => {
      const mockCreateInvoiceInput: CreateInvoiceInput = {
        amount: 100,
        currency: 'EUR',
        dueDate: new Date(),
        type: 'INVOICE',
        customerId: 'mockCustomerId',
        description: 'Test invoice',
      };

      const mockInvoice = { id: 1 } as Invoice;
      invoiceServiceMock.createInvoice.mockResolvedValue(mockInvoice);

      const invoice = await invoiceResolver.createInvoice(mockCreateInvoiceInput);

      expect(invoice).toEqual(mockInvoice);
      expect(invoiceServiceMock.createInvoice).toHaveBeenCalledWith(mockCreateInvoiceInput);
    });
  });

  describe(InvoiceResolver.prototype.updateInvoice.name, () => {
    it('should update an invoice', async () => {
      const mockUpdateInvoiceInput = { description: 'Updated invoice' };
      const mockInvoice = { id: 1 } as Invoice;
      invoiceServiceMock.updateInvoice.mockResolvedValue(mockInvoice);

      const invoice = await invoiceResolver.updateInvoice(1, mockUpdateInvoiceInput);

      expect(invoice).toEqual(mockInvoice);
      expect(invoiceServiceMock.updateInvoice).toHaveBeenCalledWith(1, mockUpdateInvoiceInput);
    });
  });

  describe(InvoiceResolver.prototype.markInvoiceAsPaid.name, () => {
    it('should mark an invoice as paid', async () => {
      const mockInvoice = { id: 1 } as Invoice;
      invoiceServiceMock.markInvoiceAsPaid.mockResolvedValue(mockInvoice);

      const invoice = await invoiceResolver.markInvoiceAsPaid(1);

      expect(invoice).toEqual(mockInvoice);
      expect(invoiceServiceMock.markInvoiceAsPaid).toHaveBeenCalledWith(1);
    });
  });

  describe(InvoiceResolver.prototype.generateStornoInvoice.name, () => {
    it('should generate a storno invoice', async () => {
      const mockInvoice = { id: 1 } as Invoice;
      invoiceServiceMock.generateStornoInvoice.mockResolvedValue(mockInvoice);

      const invoice = await invoiceResolver.generateStornoInvoice(1);

      expect(invoice).toEqual(mockInvoice);
      expect(invoiceServiceMock.generateStornoInvoice).toHaveBeenCalledWith(1);
    });
  });
});
