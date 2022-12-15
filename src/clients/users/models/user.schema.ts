import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Document } from 'mongoose';
import { Address } from 'src/common/address.input';
import { UserRole } from 'src/common/interface';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => String, { nullable: true, description: 'User Identity.' })
  @Prop({
    type: String,
    unique: true,
    required: true,
    description: 'User Identity.',
  })
  UserID: string;

  @Field(() => String, { description: 'User Email' })
  @Prop({ type: String, maxLength: 50, unique: true })
  Email: string;

  @Prop({ type: String, required: false })
  Password: string;

  @Field(() => [String], {
    nullable: true,
    description: 'User PhoneNumbers.',
  })
  @Prop({ type: [String] })
  PhoneNumbers?: string[];

  @Field(() => String, { nullable: true, description: 'User FirstName.' })
  @Prop({ type: String, maxLength: 50 })
  FirstName: string;

  @Field(() => String, { nullable: true, description: 'User LastName.' })
  @Prop({ type: String, maxLength: 50 })
  LastName: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'User Address.',
  })
  @Prop({ type: Address, required: false })
  Address: Address;

  @Field(() => [String], { nullable: true, description: 'User Roles.' })
  @Prop({ type: [String], default: [UserRole.USER] })
  Roles: UserRole[];

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'User CreatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'User UpdatedAt.',
  })
  @Prop({ type: Date, default: Date.now })
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
