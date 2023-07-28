import { Field, ArgsType } from '@nestjs/graphql';
import { FetchArguments } from './common';
import { Validate } from 'class-validator';
import { MoongooseIDValidator } from './mongoose.id.validation';

@ArgsType()
export class FetchCustomersArgument extends FetchArguments {
  @Field(() => String, { nullable: true, description: 'Customer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  CustomerID: string;
}
