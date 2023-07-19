import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Address } from '../../../common/address.input';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'User Email.', nullable: false })
  @IsEmail({}, { message: 'Email is not valid.' })
  Email: string;

  @Field(() => String, { description: 'User Password', nullable: false })
  @IsString({ message: 'Password is not valid.' })
  Password: string;

  @Field(() => String, { description: 'User ConfirmPassword', nullable: false })
  @IsString({ message: 'ConfirmPassword is not valid.' })
  ConfirmPassword: string;

  @Field(() => [String], { nullable: true, description: 'User PhoneNumber.' })
  @IsOptional()
  @IsArray({ message: 'PhoneNumber is not valid.' })
  PhoneNumbers?: string[];

  @Field(() => String, { nullable: true, description: 'User FirstName.' })
  @IsOptional()
  @IsString({ message: 'FirstName is not valid.' })
  FirstName?: string;

  @Field(() => String, { nullable: true, description: 'User LastName.' })
  @IsOptional()
  @IsString({ message: 'LastName is not valid.' })
  LastName?: string;

  @Field(() => Address, { nullable: true, description: 'User Address.' })
  @ValidateNested()
  @IsOptional()
  Address?: Address;
}

@InputType()
export class FindUserInput {
  @Field(() => String, { description: 'User ID.', nullable: false })
  @IsUUID()
  UserID: string;
}

@InputType()
export class LogInUserInput {
  @Field(() => String, { description: 'User email.', nullable: false })
  @IsEmail({}, { message: 'Email is not valid.' })
  Email: string;

  @Field(() => String, { description: 'User password.', nullable: false })
  @IsString({ message: 'Password is not valid.' })
  Password: string;
}
