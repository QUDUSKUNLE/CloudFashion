import { Field, ArgsType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { MoongooseIDValidator } from './mongoose.id.validation';
import { FetchArguments } from './common';

@ArgsType()
export class FetchProductsArgument extends FetchArguments {
  @Field(() => String, { nullable: true, description: 'Product Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  ProductID: string;
}