import {
  Field,
  InputType,
  registerEnumType,
  Int,
  ArgsType,
} from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Role, State, Address } from '../../common';

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

@ArgsType()
export class FetchDesignerArguments {
  @Field(() => Int)
  @Min(0)
  Skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  Take = 25;

  @Field(() => String, { nullable: true, description: 'Designer Identity.' })
  DesignerID?: string;
}
