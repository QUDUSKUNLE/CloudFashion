import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Address } from '../../common';

@ObjectType()
export class Designer {
  @Field(() => String, { nullable: true, description: 'Designer Identity' })
  DesignerID: string;

  @Field(() => String, { nullable: false, description: 'Designer Name' })
  DesignerName: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Designer PhoneNumbers.',
  })
  DesignerPhoneNumbers?: string[];

  @Field(() => GraphQLJSON, {
    nullable: false,
    description: 'Designer Address.',
  })
  DesignerAddress?: Address;

  UserID: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Designer CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Designer UpdatedAt.',
  })
  UpdatedAt: Date;
}
