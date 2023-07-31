import { CreateMeasurementInput } from './create-measurement.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMeasurementInput extends PartialType(
  CreateMeasurementInput,
) {
  @Field(() => String, { description: 'Measurement ID.', nullable: false })
  MeasurementID: string;
}
