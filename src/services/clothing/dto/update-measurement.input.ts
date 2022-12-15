import { CreateMeasurementInput } from './create-measurement.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateMeasurementInput extends PartialType(
  CreateMeasurementInput,
) {
  @Field(() => String, { description: 'Measurement ID.' })
  @IsUUID()
  MeasurementID: string;
}
