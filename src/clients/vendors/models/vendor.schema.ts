import GraphQLJSON from 'graphql-type-json';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Address } from '../../../common/address.input';

export type VendorDocument = Vendor & Document;

@Schema()
@ObjectType()
export class Vendor {
  @Field(() => String, { nullable: true, description: 'Vendor Identity' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Vendor Identity.',
  })
  VendorID: string;

  @Field(() => String, { nullable: true, description: 'Vendor Naame' })
  @Prop({ type: String, unique: true, maxLength: 50, required: false })
  VendorName?: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Vendor PhoneNumbers.',
  })
  @Prop({ type: [String], required: false })
  VendorPhoneNumber?: string[];

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Vendor Address.',
  })
  @Prop({ type: Address, required: false })
  VendorAddress?: Address;

  @Prop({ type: String, required: true, unique: true })
  UserID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Vendor CreatedAt',
  })
  @Prop({ type: Date, default: Date.now() })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Vendor UpdatedAt',
  })
  @Prop({ type: Date, default: Date.now() })
  UpdatedAt: Date;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
