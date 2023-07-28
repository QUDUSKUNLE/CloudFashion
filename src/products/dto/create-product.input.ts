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
import { MoongooseIDValidator, FetchArguments } from '../../common';

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

@ArgsType()
export class DesignerFetchCustomersProducts extends FetchArguments {}

@ArgsType()
export class DesignerFetchCustomerProducts extends FetchArguments {
  @Field(() => String, { nullable: false, description: 'Customer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  CustomerID: string;
}

@ArgsType()
export class DesignerFetchCustomerProduct {
  @Field(() => String, { nullable: false, description: 'Product Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  ProductID: string;
}

@ArgsType()
export class CustomerFetchProducts extends DesignerFetchCustomerProducts {}

@ArgsType()
export class CustomerFetchProduct extends DesignerFetchCustomerProduct {
  @Field(() => String, { nullable: false, description: 'Customer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  CustomerID: string;
}

@ArgsType()
export class FetchDesignerProductsArguments extends FetchArguments {
  @Field(() => String, { nullable: false, description: 'Designer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  DesignerID: string;
}

@ArgsType()
export class FetchDesignerCustomersProductsArguments extends FetchArguments {
  @Field(() => String, { nullable: false, description: 'Designer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  DesignerID: string;

  @Field(() => String, { nullable: false, description: 'Customer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  CustomerID: string;
}
