import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateMeasurementInput } from './create-measurement.input';

@InputType()
export class UpdateMeasurementInput extends PartialType(
  CreateMeasurementInput,
) {
  @Field(() => String, { description: 'Measurement ID.' })
  @IsUUID()
  MeasurementID: string;
}
