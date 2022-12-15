import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateShipmentInput {
  @Field(() => String, { description: 'Item identity.' })
  @IsString()
  ItemID: string;

  @Field(() => String, { description: 'Order identity.' })
  @IsUUID()
  OrderID: string;
}

@InputType()
export class FindShipmentInput {
  @Field(() => String, { description: 'Shipment ID' })
  @IsUUID()
  ShipmentID: string;
}
