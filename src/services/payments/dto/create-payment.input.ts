import { Field, Float, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { PaymentStatus } from '../interfaces/payment.enums';

@InputType()
export class CreatePaymentInput {
  @Field(() => PaymentStatus, {
    nullable: false,
    description: 'Payment status.',
  })
  @IsEnum(PaymentStatus)
  PaymentStatus: PaymentStatus;

  @Field(() => Float, { description: 'Payment Amount.' })
  @IsNumber()
  PaymentAmount: number;

  @Field(() => String, {
    nullable: false,
    description: 'Payment Tracking identity',
  })
  @IsString()
  PaymentTrackingID: string;

  @Field(() => String, { description: 'Orders identity.' })
  @IsUUID()
  OrderID: string;
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status',
});

@InputType()
export class FindPaymentInput {
  @Field(() => String, { description: 'Payment ID' })
  @IsUUID()
  PaymentID: string;
}
