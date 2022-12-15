import { CreateClothingInput } from './create-clothing.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateClothingInput extends PartialType(CreateClothingInput) {
  @Field(() => String, { description: 'Clothing ID.' })
  @IsUUID()
  ClothID: string;
}
