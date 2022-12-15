import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address, Status } from 'src/common/address.input';
import { ItemStatus } from 'src/common/interface';

export type OrderDocument = Order & Document;
export type ItemDocument = Item & Document;

@Schema()
@ObjectType()
export class Item {
  @Field(() => String, { description: 'Item Identity.' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Item Identity.',
  })
  ItemID: string;

  @Field(() => Int, { nullable: false, description: 'Item count.' })
  @Prop({ type: Number, required: true })
  ItemCount: number;

  @Field(() => Float, { nullable: true })
  @Prop({ type: Number, required: true })
  ItemTotalCost: number;

  @Field(() => String, { nullable: true, description: 'Order status.' })
  @Prop({ type: String, default: ItemStatus.PROCESSING })
  ItemStatus: ItemStatus;

  @Field(() => GraphQLJSON, { nullable: true, description: 'Order status.' })
  @Prop({ type: Object })
  Statuses: Status[];

  @Prop({ type: String })
  ProductID: string;

  @Prop({ type: String })
  OrderID: string;

  @Prop({ type: String })
  ShipmentID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Item CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Item UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

@Schema()
@ObjectType()
export class Order {
  @Field(() => String, { description: 'Order identity.' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'OrderID Identity.',
  })
  OrderID: string;

  @Field(() => Float, { nullable: true, description: 'Order Total Amount.' })
  @Prop({ type: Number })
  OrderAmount: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Order Accrued Discounts.',
  })
  @Prop({ type: Number })
  OrderDiscount: number;

  @Field(() => GraphQLJSON, { nullable: true, description: 'Order Address.' })
  @Prop({ type: Object, required: true })
  OrderAddress: Address;

  @Field(() => String, { nullable: true, description: 'Order status.' })
  @Prop({ type: String, default: ItemStatus.COMPLETED })
  OrderStatus: string;

  @Prop({ type: String, required: true })
  UserID: string;

  @Prop({ type: [String] })
  Items: string[];

  @Field(() => String, {
    nullable: true,
    description: 'Order Payment Identity.',
  })
  @Prop({ type: String, required: true })
  PaymentID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Order CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Order UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

@ObjectType()
export class OrderResponse {
  @Field(() => String, { description: 'Order Response.' })
  OrderMessage: string;

  @Field(() => String, { description: 'Order status.' })
  OrderStatus: ItemStatus;

  @Field(() => String, { description: 'Order Identity.' })
  OrderID: string;
}

@ObjectType()
export class ItemResponse {
  @Field(() => String, { description: 'Item Response Message.' })
  ItemMessage: string;

  @Field(() => String, { description: 'Item Status.' })
  ItemStatus: ItemStatus;

  @Field(() => String, { description: 'Item Identity.' })
  ItemID: string;
}

@ObjectType()
export class AOrder {
  @Field(() => String, { description: 'Order identity.' })
  OrderID: string;

  @Field(() => Float, { nullable: true, description: 'Order Total Amount.' })
  OrderAmount: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Order Accrued Discounts.',
  })
  OrderDiscount: number;

  @Field(() => GraphQLJSON, { nullable: true, description: 'Order Address.' })
  OrderAddress: Address;

  @Field(() => String, { nullable: true, description: 'Order status.' })
  OrderStatus: string;

  @Field(() => String, {
    nullable: true,
    description: 'Order Payment Identity.',
  })
  PaymentID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Order CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Order UpdatedAt.',
  })
  UpdatedAt: Date;

  @Field(() => [Item])
  OrderItems: Item[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export const ItemSchema = SchemaFactory.createForClass(Item);
