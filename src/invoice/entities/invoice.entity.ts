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

  @Field(() => InvoiceType)
  type: InvoiceType;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => Int)
  amount: number;

  @Field(() => Boolean)
  isPaid: boolean;

  @Field(() => GraphQLISODateTime)
  dueDate: Date;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  customerId: string | null;

  @Field(() => String, { nullable: true })
  projectId: string | null;
}
