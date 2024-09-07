import { ObjectType, Field, Int, registerEnumType, GraphQLISODateTime } from '@nestjs/graphql';
import { Currency, InvoiceType } from '@prisma/client';

registerEnumType(InvoiceType, {
  name: 'InvoiceType',
  description: 'Type of the invoice, either INVOICE or STORNO',
});

registerEnumType(Currency, {
  name: 'Currency',
  description: 'Currency of the invoice, either EUR or RON',
});

@ObjectType()
export class Invoice {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  amount: number;

  @Field(() => Boolean)
  isPaid: boolean;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => InvoiceType)
  type: InvoiceType;

  @Field(() => GraphQLISODateTime)
  dueDate: Date;

  @Field(() => String, { nullable: true })
  description: string;
}
