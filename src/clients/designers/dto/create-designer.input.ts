import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import {
  IsUUID,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { UserRole, States } from 'src/common/interface';
import { Address } from 'src/common/address.input';

@InputType()
export class CreateDesignerInput {
  @Field(() => UserRole, { nullable: false, description: 'Designer role' })
  @IsEnum(UserRole)
  Role: UserRole;

  @Field(() => String, { nullable: false, description: 'Designer name' })
  @IsString()
  DesignerName: string;

  @Field(() => [String], {
    nullable: false,
    description: 'Designer phoneNumber.',
  })
  @IsArray()
  DesignerPhoneNumbers: string[];

  @Field(() => Address, {
    nullable: false,
    description: 'Designer addresses.',
  })
  @ValidateNested()
  DesignerAddress: Address;
}

@InputType()
export class FindDesignerInput {
  @Field(() => String, { description: 'Designer ID' })
  @IsUUID()
  DesignerID: string;
}

registerEnumType(States, {
  name: 'States',
  description: 'States',
});
