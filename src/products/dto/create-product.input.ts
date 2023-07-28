import {
  InputType,
  Field,
  registerEnumType,
  Float,
  Int,
  ArgsType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsInt, Validate, Min, Max } from 'class-validator';
import { ProductEnum } from '../interfaces/product.enums';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload/processRequest.js';
import { MoongooseIDValidator } from '../../common/mongoose.id.validation';

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

  @Field(() => String, { description: 'Customer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  CustomerID: string;
}

registerEnumType(ProductEnum, {
  name: 'ProductName',
  description: 'Product name',
});

@InputType()
export class FindProductInput {
  @Field(() => String, { description: 'Product Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  ProductID: string;
}

@ArgsType()
export class FetchProductsArguments {
  @Field(() => Int)
  @Min(0)
  Skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  Take = 25;

  @Field(() => String, { nullable: true, description: 'Designer Identity.' })
  ProductID?: string;
}
