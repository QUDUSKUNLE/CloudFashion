import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsUUID,
  ValidateNested,
  IsEnum,
  IsArray,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../../common/interface';
import { Address } from '../../../common/address.input';

@InputType()
export class CreateVendorInput {
  @Field(() => UserRole, { nullable: false, description: 'Vendor Role' })
  @IsEnum(UserRole)
  Role: UserRole;

  @Field(() => String, { description: 'Vendor Name' })
  @IsString()
  VendorName: string;

  @Field(() => [String], {
    description: 'Vendor PhoneNumbers.',
  })
  @IsArray()
  @MaxLength(12, { each: true })
  VendorPhoneNumber: string[];

  @Field(() => Address, {
    description: 'Vendor Address.',
  })
  @ValidateNested()
  VendorAddress: Address;
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
});

@InputType()
export class FindVendorInput {
  @Field(() => String, { description: 'Vendor Identity.' })
  @IsUUID()
  VendorID: string;
}
