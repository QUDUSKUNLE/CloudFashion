import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMesaurementInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
