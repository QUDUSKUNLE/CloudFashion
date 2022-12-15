import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsString, IsInt, IsDate } from 'class-validator';
import { States, ItemStatus } from 'src/common/interface';

@InputType()
export class Address {
  @Field(() => Int, { nullable: false, description: 'Street number.' })
  @IsInt()
  StreetNo: number;

  @Field(() => String, { nullable: false, description: 'Street name.' })
  @IsString()
  StreetName: string;

  @Field(() => String, { nullable: false, description: 'City' })
  @IsString()
  City: string;

  @Field(() => States, { nullable: false, description: 'States' })
  @IsEnum(States)
  State: States;
}

@InputType()
export class Status {
  @Field(() => ItemStatus, { nullable: false, description: 'Item status' })
  @IsEnum(ItemStatus)
  ItemStatus: ItemStatus;

  @Field(() => Date, { nullable: true, description: 'Item status datetime.' })
  @IsDate()
  DateTime: Date;
}
