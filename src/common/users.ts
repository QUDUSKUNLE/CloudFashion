import { Field, ArgsType } from '@nestjs/graphql';
import { Validate } from 'class-validator';
import { MoongooseIDValidator } from './mongoose.id.validation';
import { FetchArguments } from './common';

@ArgsType()
export class FetchUsersArgument extends FetchArguments {
  @Field(() => String, { nullable: true, description: 'User Identity.' })
  @Validate(MoongooseIDValidator, [], { always: true })
  UserID: string;
}
