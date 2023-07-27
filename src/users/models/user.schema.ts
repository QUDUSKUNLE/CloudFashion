import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Address } from '../../common/address.input';
import { Designer } from '../../designers/models/designers.schema';
import { Role } from '../../common/interface';

@ObjectType()
export class User {
  @Field(() => String, { nullable: true, description: 'User Identity.' })
  UserID: string;

  @Field(() => String, { description: 'User Email' })
  Email: string;

  Password: string;

  @Field(() => [String], {
    nullable: true,
    description: 'User PhoneNumbers.',
  })
  PhoneNumbers?: string[];

  @Field(() => String, { nullable: true, description: 'User FirstName.' })
  FirstName?: string;

  @Field(() => String, { nullable: true, description: 'User LastName.' })
  LastName?: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'User Address.',
  })
  Address?: Address;

  @Field(() => [String], { nullable: true, description: 'User Roles.' })
  Roles: Role[];

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'User CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'User UpdatedAt.',
  })
  UpdatedAt: Date;
}

@ObjectType()
export class UserEntity {
  @Field(() => String, { nullable: true, description: 'User Identity.' })
  UserID: string;

  @Field(() => String, { description: 'User Email' })
  Email: string;

  @Field(() => [String], {
    nullable: true,
    description: 'User PhoneNumbers.',
  })
  PhoneNumbers?: string[];

  @Field(() => String, { nullable: true, description: 'User FirstName.' })
  FirstName?: string;

  @Field(() => String, { nullable: true, description: 'User LastName.' })
  LastName?: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'User Address.',
  })
  Address?: Address;

  @Field(() => [String], { nullable: true, description: 'User Roles.' })
  Roles: Role[];

  Designer?: Designer;
}

@ObjectType()
export class LoginResponse {
  @Field(() => String, { description: 'User AccessToken.' })
  AccessToken: string;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => String, { description: 'User log out.' })
  Message: string;
}

@ObjectType()
export class Sabi extends UserEntity {}

declare global {
  namespace Express {
    interface Request {
      sub: Sabi;
    }
  }
}
