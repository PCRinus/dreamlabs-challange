import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { InvoiceService, SelectionFilters } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { Currency, InvoiceType } from '@prisma/client';
import { CreateInvoiceInput } from './dto/create-invoice.input';
import { UpdateInvoiceInput } from './dto/update-invoice.input';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Query(() => Invoice, { name: 'selectInvoiceById' })
  async selectInvoiceById(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    return await this.invoiceService.selectInvoiceById(id);
  }

  @Query(() => [Invoice], { name: 'selectInvoices' })
  async selectInvoices(
    @Args('currency', { type: () => Currency }) currency: Currency,
    @Args('invoiceType', { type: () => InvoiceType }) invoiceType: InvoiceType,
    @Args('customerId', { type: () => String, nullable: true }) customerId?: string,
    @Args('projectId', { type: () => String, nullable: true }) projectId?: string,
  ): Promise<Invoice[]> {
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
    return await this.invoiceService.createInvoice(invoiceData);
  }

  @Mutation(() => Invoice, { name: 'updateInvoice' })
  async updateInvoice(
    @Args('id', { type: () => Int }) id: number,
    @Args('invoiceData', { type: () => UpdateInvoiceInput }) invoiceData: UpdateInvoiceInput,
  ): Promise<Invoice> {
    return await this.invoiceService.updateInvoice(id, invoiceData);
  }

  @Mutation(() => Invoice, { name: 'markInvoiceAsPaid' })
  async markInvoiceAsPaid(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    return await this.invoiceService.markInvoiceAsPaid(id);
  }

  @Mutation(() => Invoice, { name: 'generateStornoInvoice' })
  async generateStornoInvoice(@Args('id', { type: () => Int }) id: number): Promise<Invoice> {
    return await this.invoiceService.generateStornoInvoice(id);
  }
}
