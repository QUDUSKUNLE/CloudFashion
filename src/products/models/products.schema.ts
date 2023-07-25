import {
  Field,
  Float,
  GraphQLISODateTime,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => String, {
    nullable: true,
    description: 'Product Identity',
  })
  ProductID: string;

  @Field(() => String, { description: 'Product Name' })
  ProductName: string;

  @Field(() => Int, { description: 'Product Quantity' })
  ProductQuantity: number;

  @Field(() => String, { description: 'Product Video.', nullable: true })
  ProductVideo: string;

  @Field(() => Float, { description: 'Product Price' })
  ProductPrice: number;

  @Field(() => Float, { description: 'Product Discount.' })
  ProductDiscount: number;

  VendorID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Product CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Product UpdatedAt.',
  })
  UpdatedAt: Date;
}
