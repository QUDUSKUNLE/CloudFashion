import { Document } from 'mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Address } from 'src/common/address.input';

export type DesignerDocument = Designer & Document;

@Schema()
@ObjectType()
export class Designer {
  @Field(() => String, { nullable: true, description: 'Designer Identity' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Designer Identity.',
  })
  DesignerID: string;

  @Field(() => String, { nullable: false, description: 'Designer Name' })
  @Prop({
    type: String,
    required: true,
    unique: true,
    description: 'Designer Identity.',
  })
  DesignerName: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Designer PhoneNumbers.',
  })
  @Prop({ type: [String], required: true })
  DesignerPhoneNumbers: string[];

  @Field(() => GraphQLJSON, {
    nullable: false,
    description: 'Designer Address.',
  })
  @Prop({ type: Address, required: true })
  DesignerAddress: Address;

  @Prop({ type: String, required: true, unique: true })
  UserID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Designer CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Designer UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

export const DesignerSchema = SchemaFactory.createForClass(Designer);
