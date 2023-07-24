import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Address } from '../../common/address.input';

@InputType()
export class CreateCustomer {
  @Field(() => String, { nullable: false, description: 'Customer name' })
  @IsString()
  CustomerName: string;

  @Field(() => String, { nullable: true, description: 'Customer name' })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  CustomerEmail?: string;

  @Field(() => [String], {
    nullable: true,
    description: 'Customer Phonenumbers',
  })
  @IsArray()
  @IsOptional()
  CustomerPhoneNumbers?: string[];

  @Field(() => Address, { nullable: true, description: 'User Address.' })
  @ValidateNested()
  @IsOptional()
  CustomerAddress?: Address;
}

@InputType()
export class CreateCustomerInput {
  @Field(() => [CreateCustomer], {
    nullable: false,
    description: 'Create Customers',
  })
  @IsArray()
  readonly CreateCustomers: CreateCustomer[];
}
