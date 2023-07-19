import { Field, ObjectType } from '@nestjs/graphql';
import { ItemStatus } from '../../../common/interface';

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
  @Field(() => String, { description: 'Item Response.' })
  ItemMessage: string;

  @Field(() => String, { description: 'Item status.' })
  ItemStatus: ItemStatus;

  @Field(() => String, { description: 'Item Identity.' })
  ItemID: string;
}
