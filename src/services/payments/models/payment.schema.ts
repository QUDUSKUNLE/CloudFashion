import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentStatus } from '../interfaces/payment.enums';

export type PaymentDocument = Payment & Document;

@Schema()
@ObjectType()
export class Payment {
  @Field(() => String, {
    nullable: true,
    description: 'Payment Identity',
  })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Item Identity.',
  })
  PaymentID: string;

  @Field(() => Float, { description: 'Payment Amount' })
  @Prop({ type: Number, required: false })
  PaymentAmount: number;

  @Field(() => String, { description: 'Payment status' })
  @Prop({
    type: String,
    default: PaymentStatus.PROCESSING,
  })
  PaymentStatus: PaymentStatus;

  @Field(() => String, {
    nullable: false,
    description: 'Payment Tracking Identity',
  })
  @Prop({ type: String, required: false, unique: true })
  PaymentTrackingID: string;

  @Prop({ type: String })
  PaymentReference: string;

  @Prop({ type: String })
  UserID: string;

  @Prop({ type: String })
  OrderID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Payment CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Payment UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
