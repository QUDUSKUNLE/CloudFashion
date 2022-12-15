import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @Field(() => String, { description: 'Payment identity.', nullable: false })
  @IsUUID()
  PaymentID: string;
}
