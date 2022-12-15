import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductEnum } from '../interfaces/product.enums';

export type ProductDocument = Product & Document;

@Schema()
@ObjectType()
export class Product {
  @Field(() => String, {
    nullable: true,
    description: 'Product Identity',
  })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'Product Identity.',
  })
  ProductID: string;

  @Field(() => String, { description: 'Product Name' })
  @Prop({
    type: String,
    default: ProductEnum.Kaftan,
  })
  ProductName: string;

  @Field(() => Int, { description: 'Product Quantity' })
  @Prop({ type: Number, default: 100 })
  ProductQuantity: number;

  @Field(() => String, { description: 'Product Video.', nullable: true })
  @Prop({ type: String, required: true })
  ProductVideo: string;

  @Field(() => Float, { description: 'Product Price' })
  @Prop({ type: Number, required: true })
  ProductPrice: number;

  @Field(() => Float, { description: 'Product Discount.' })
  @Prop({ type: Number, default: 0 })
  ProductDiscount: number;

  @Prop({ type: String, required: true })
  VendorID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Product CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Product UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  UpdatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
