import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';
import { Address } from '../../../common/address.input';
import { UserRole } from '../../../common/interface';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => String, { nullable: true, description: 'User Identity.' })
  UserID: string;

  @Field(() => String, { description: 'User Email' })
  Email: string;

  @Prop({ type: String, required: false })
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
  Roles: UserRole[];

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
export class LoginResponse {
  @Field(() => String, { description: 'User AccessToken.' })
  AccessToken: string;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => String, { description: 'User log out.' })
  Message: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
@ObjectType()
export class Sabi extends User {}

declare global {
  namespace Express {
    interface Request {
      sub: Sabi;
    }
  }
}
