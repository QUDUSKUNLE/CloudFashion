import { Field, ArgsType } from '@nestjs/graphql';
import { FetchArguments } from './common';
import { Validate } from 'class-validator';
import { MoongooseIDValidator } from './mongoose.id.validation';

@ArgsType()
export class FetchDesignersArgument extends FetchArguments {
  @Field(() => String, { nullable: true, description: 'Designer Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  DesignerID: string;
}
