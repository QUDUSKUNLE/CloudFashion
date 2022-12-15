import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Vendor } from '../../../clients/vendors/models/vendor.schema';
import { Item } from '../../orders/models/orders.schema';

export type ShipmentDocument = Shipment & Document;

@Schema()
@ObjectType()
export class Shipment {
  @Field(() => String, { nullable: true, description: 'Shipment Identity' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Shipment Identity.',
  })
  ShipmentID: string;

  @Field(() => Item, {
    nullable: true,
    description: 'Item entity.',
  })
  @Prop({ type: Item })
  Item: Item;

  @Prop({ type: Vendor })
  Vendor: Vendor;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Shipment CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Shipment UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
