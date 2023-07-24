import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Address } from '../../common/address.input';
import { Role, State } from '../../common/interface';

@InputType()
export class CreateDesignerInput {
  @Field(() => Role, { nullable: false, description: 'Designer role' })
  @IsEnum(Role)
  Role: Role;

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
  @IsString()
  DesignerID: string;
}

registerEnumType(State, {
  name: 'State',
  description: 'State',
});

registerEnumType(Role, {
  name: 'Role',
  description: 'Role',
});
