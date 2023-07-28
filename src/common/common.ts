import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';

@ArgsType()
export class FetchArguments {
  @Field(() => Int)
  @Min(0)
  Skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  Take = 25;
}
