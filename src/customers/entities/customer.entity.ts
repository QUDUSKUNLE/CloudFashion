import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Customer {
  @Field(() => Int, { nullable: true, description: 'Customer counts' })
  Count: number;
}
