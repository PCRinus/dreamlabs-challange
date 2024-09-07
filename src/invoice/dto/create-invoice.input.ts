import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { Currency, InvoiceType } from '@prisma/client';

@InputType()
export class CreateInvoiceInput {
  @Field(() => Int)
  amount: number;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => InvoiceType)
  type: InvoiceType;

  @Field(() => GraphQLISODateTime)
  dueDate: Date;

  @Field(() => String)
  description: string;

  @Field(() => String)
  customerId: string;
}
