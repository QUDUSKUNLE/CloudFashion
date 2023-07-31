import { CreateMesaurementInput } from './create-mesaurement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMesaurementInput extends PartialType(CreateMesaurementInput) {
  @Field(() => Int)
  id: number;
}
