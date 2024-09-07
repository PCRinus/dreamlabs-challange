import { CreateInvoiceInput } from './create-invoice.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInvoiceInput extends PartialType(CreateInvoiceInput) {}
