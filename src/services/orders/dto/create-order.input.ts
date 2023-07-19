import {
  Field,
  Float,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Address } from '../../../common/address.input';
import { ItemStatus } from '../../../common/interface';
import { Channels, Currency } from '../../stack/interface';

@InputType()
export class OrderPayment {
  @Field(() => Int, { nullable: false, description: 'Payment amount.' })
  @IsNumber()
  Amount: number;

  @Field(() => Currency, { nullable: false, description: 'Payment currency' })
  @IsEnum(Currency)
  Currency: Currency;

  @Field(() => Channels, { nullable: false, description: 'Payment currency' })
  @IsEnum(Channels)
  Channel: Channels;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ItemStatus, { nullable: false, description: 'Order status.' })
  @IsEnum(ItemStatus)
  OrderStatus: ItemStatus;

  @Field(() => OrderPayment, {
    nullable: true,
    description: 'Payment identity.',
  })
  Payments: OrderPayment;

  @Field(() => Address, { nullable: false, description: 'Order address.' })
  @ValidateNested()
  OrderAddress: Address;

  @Field(() => String, {
    nullable: false,
    description: 'Payment Tracking Identity.',
  })
  @IsString({ message: 'Payment Tracking Identity is required.' })
  @IsNotEmpty()
  PaymentTrackingID: string;

  @Field(() => Float, { nullable: false, description: 'Order total cost.' })
  @IsNumber()
  OrderTotalCost: number;

  @Field(() => [OrderDetails], {
    nullable: false,
    description: 'Product identity',
  })
  @IsArray()
  OrderDetails: OrderDetails[];
}

@InputType()
export class UpdateItemInput {
  @Field(() => ItemStatus, { nullable: false, description: 'Item status' })
  @IsEnum(ItemStatus)
  ItemStatus: ItemStatus;

  @Field(() => String, { nullable: false, description: 'Item ID.' })
  @IsString()
  ItemID: string;
}

@InputType()
export class OrderDetails {
  @Field(() => String, { nullable: false, description: 'Product ID.' })
  @IsUUID()
  ProductID: string;

  @Field(() => Int, { nullable: false, description: 'Product count.' })
  @IsNumber()
  Count: number;
}

registerEnumType(ItemStatus, {
  name: 'ItemStatus',
  description: 'Order status',
});

registerEnumType(Currency, {
  name: 'Currency',
  description: 'Payment currency',
});

registerEnumType(Channels, {
  name: 'Channels',
  description: 'Payment channels',
});

@InputType()
export class FindOrderInput {
  @Field(() => String, { description: 'Order ID' })
  @IsUUID()
  OrderID: string;
}
