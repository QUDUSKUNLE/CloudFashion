import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { CreateMeasurement } from '../dto/create-measurement.input';

@ObjectType()
export class Measurement {
  @Field(() => String, { description: 'Measurement identity' })
  MeasurementID: string;

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Cloth measurement.',
  })
  Measurement: CreateMeasurement;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Measurement CreatedAt.',
  })
  CreatedAt: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'Measurement UpdatedAt.',
  })
  UpdatedAt: Date;
}
