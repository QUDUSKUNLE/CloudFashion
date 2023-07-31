import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsEnum, IsInt, IsString, Max, Min } from 'class-validator';
import { ItemStatus, State } from './interface';

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

  @Field(() => State, { nullable: false, description: 'States' })
  @IsEnum(State)
  State: State;
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

@ArgsType()
export class FetchArguments {
  @Field(() => Int)
  @Min(0)
  Skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  Take = 25;
}
