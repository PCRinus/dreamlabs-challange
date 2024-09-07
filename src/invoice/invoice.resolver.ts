import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { InvoiceService, SelectionFilters } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { Currency, InvoiceType } from '@prisma/client';

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
}
