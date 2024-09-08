import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { InvoiceService, SelectionFilters } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { Currency, InvoiceType } from '@prisma/client';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  private readonly logger = new Logger(InvoiceResolver.name);

  @Query(() => Invoice, { name: 'selectInvoiceById' })
  async selectInvoiceById(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    this.logger.log(`Selecting invoice by id: ${id}`);

    const invoice = await this.invoiceService.selectInvoiceById(id);

    if (!invoice) {
      throw new Error(`Invoice not found: ${id}`);
    }

    return invoice;
  }

  @Query(() => [Invoice], { name: 'selectInvoices' })
  async selectInvoices(
    @Args('currency', { type: () => Currency }) currency: Currency,
    @Args('invoiceType', { type: () => InvoiceType }) invoiceType: InvoiceType,
    @Args('customerId', { type: () => String, nullable: true }) customerId: string | null,
    @Args('projectId', { type: () => String, nullable: true }) projectId: string | null,
  ): Promise<Invoice[]> {
    this.logger.log(
      `Selecting invoices with filters: ${JSON.stringify({ currency, invoiceType, customerId, projectId })}`,
    );

    const selectionFilters: SelectionFilters = {
      currency,
      type: invoiceType,
      customerId,
      projectId,
    };
    return await this.invoiceService.selectInvoices(selectionFilters);
  }

  @Mutation(() => Invoice, { name: 'createInvoice' })
  async createInvoice(
    @Args('invoiceData', { type: () => CreateInvoiceInput }) invoiceData: CreateInvoiceInput,
  ): Promise<Invoice> {
    this.logger.log(`Creating invoice with data: ${JSON.stringify(invoiceData)}`);

    return await this.invoiceService.createInvoice(invoiceData);
  }

  @Mutation(() => Invoice, { name: 'updateInvoice' })
  async updateInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('invoiceData', { type: () => UpdateInvoiceInput }) invoiceData: UpdateInvoiceInput,
  ): Promise<Invoice> {
    this.logger.log(`Updating invoice with id: ${id} and data: ${JSON.stringify(invoiceData)}`);

    return await this.invoiceService.updateInvoice(id, invoiceData);
  }

  @Mutation(() => Invoice, { name: 'markInvoiceAsPaid' })
  async markInvoiceAsPaid(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    this.logger.log(`Marking invoice with id: ${id} as paid`);

    return await this.invoiceService.markInvoiceAsPaid(id);
  }

  @Mutation(() => Invoice, { name: 'generateStornoInvoice' })
  async generateStornoInvoice(@Args('id', { type: () => Int }) id: number) {
    this.logger.log(`Generating storno invoice for invoice with id: ${id}`);

    return await this.invoiceService.generateStornoInvoice(id);
  }
}
