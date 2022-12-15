import { CreateOrderInput } from './create-order.input';
import { IsUUID } from 'class-validator';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => String, { description: 'Order ID', nullable: false })
  @IsUUID()
  OrderID: string;
}
