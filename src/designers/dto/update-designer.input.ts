import { CreateDesignerInput } from './create-designer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateDesignerInput extends PartialType(CreateDesignerInput) {
  @Field(() => String, { nullable: false, description: 'Designer ID.' })
  @IsUUID()
  DesignerID: string;
}
