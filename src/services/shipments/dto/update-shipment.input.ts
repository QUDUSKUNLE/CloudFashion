import { CreateShipmentInput } from './create-shipment.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateShipmentInput extends PartialType(CreateShipmentInput) {
  @Field(() => String, { description: 'Shipment ID' })
  @IsUUID()
  ShipmentID: string;
}
