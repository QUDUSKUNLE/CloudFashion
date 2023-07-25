import {
  InputType,
  Field,
  registerEnumType,
  Float,
  Int,
} from '@nestjs/graphql';
import { IsUUID, IsEnum, IsNumber, IsInt, IsMongoId } from 'class-validator';
import { ProductEnum } from '../interfaces/product.enums';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/processRequest.js';

@InputType()
export class CreateProductInput {
  @Field(() => ProductEnum, { nullable: false, description: 'Product name.' })
  @IsEnum(ProductEnum)
  ProductName: string;

  @Field(() => GraphQLUpload, { nullable: true, description: 'Product video.' })
  ProductVideo: FileUpload;

  @Field(() => Float, { description: 'Product price.' })
  @IsNumber()
  ProductPrice: number;

  @Field(() => Float, { nullable: true, description: 'Product discount.' })
  ProductDiscount: number;

  @Field(() => Int, { description: 'Product quantity.' })
  @IsInt()
  ProductQuantity: number;

  @Field(() => Int, { description: 'Product quantity.' })
  @IsMongoId()
  CustomerID: string;
}

registerEnumType(ProductEnum, {
  name: 'ProductName',
  description: 'Product name',
});

@InputType()
export class FindProductInput {
  @Field(() => String, { description: 'Product ID' })
  @IsUUID()
  ProductID: string;
}
