import GraphQLJSON from 'graphql-type-json';
import { Field, GraphQLISODateTime, ObjectType, Int } from '@nestjs/graphql';
import { Address } from '../../common';

@ObjectType()
export class Customer {
  @Field(() => Int, { nullable: true, description: 'Customer counts' })
  Count: number;
}

@ObjectType()
export class Customers {
  @Field(() => String, { nullable: true, description: 'Customer Identity.' })
  CustomerID: string;

  @Field(() => String, { description: 'Customer Email' })
  CustomerEmail: string;

  @Field(() => [String], {
    nullable: false,
    description: 'Customer PhoneNumbers.',
  })
  CustomerPhoneNumbers: string[];

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Customer Address',
  })
  CustomerAddress?: Address;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Customer CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Customer UpdatedAt.',
  })
  UpdatedAt: Date;
}
