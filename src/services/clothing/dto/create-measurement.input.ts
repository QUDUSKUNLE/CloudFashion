import { IsEnum, IsUUID, IsNumber, ValidateNested } from 'class-validator';
import { InputType, Field, PickType, Float } from '@nestjs/graphql';
import {
  Measurement,
  PucketType,
  WaistTightType,
  ButtonType,
  DesignType,
  ColarNeckType,
  LinkType,
} from '../interface/interface';

@InputType()
export class TrouserInput {
  @Field(() => Float, { description: 'Trouser or Shirt length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  Length: number;

  @Field(() => Float, { description: 'Trouser Waist length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  WaistLength: number;

  @Field(() => Float, { description: 'Trouser Tigh length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  TighLength: number;

  @Field(() => Float, { description: 'Trouser Ankle length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  AnkleLength: number;

  @Field(() => PucketType, {
    nullable: true,
    description: 'Trouser pucket type',
  })
  @IsEnum(PucketType)
  PucketType: PucketType;

  @Field(() => WaistTightType, {
    nullable: true,
    description: 'Trouser waist tightening type.',
  })
  @IsEnum(WaistTightType)
  WaistTightType: WaistTightType;
}

@InputType()
export class ShirtInput extends PickType(TrouserInput, [
  'Length',
  'PucketType',
] as const) {
  @Field(() => Float, { description: 'Shirt Shoulder length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  ShoulderLength: number;

  @Field(() => Float, { description: 'Shirt Arm length' })
  @IsNumber({ maxDecimalPlaces: 2 })
  ArmLength: number;

  @Field(() => Float, { description: 'Shirt Arm width' })
  @IsNumber({ maxDecimalPlaces: 2 })
  ArmWidth: number;

  @Field(() => ButtonType, { description: 'Shirt Button Type' })
  @IsEnum(ButtonType)
  ButtonType: ButtonType;

  @Field(() => DesignType, { nullable: true, description: 'Shirt Design Type' })
  @IsEnum(DesignType)
  DesignType: DesignType;

  @Field(() => ColarNeckType, {
    nullable: true,
    description: 'Shirt Collar Type',
  })
  @IsEnum(ColarNeckType)
  ColarNeckType: ColarNeckType;

  @Field(() => LinkType, { nullable: true, description: 'Shirt Link Type' })
  LinkType: LinkType;
}

@InputType()
export class CapInput extends PickType(ShirtInput, [
  'Length',
  'DesignType',
] as const) {
  @Field(() => Float, { description: 'Cap Height' })
  @IsNumber({ maxDecimalPlaces: 2 })
  Height: number;
}

@InputType()
export class AgbadaInput extends CapInput {}

@InputType()
export class CreateMeasurement {
  @Field(() => Measurement, { description: 'Measurement unit' })
  @IsEnum(Measurement)
  readonly MeasurementUnit: Measurement;

  @Field(() => TrouserInput, { description: 'Trouser measurements' })
  @ValidateNested()
  readonly Trouser: TrouserInput;

  @Field(() => ShirtInput, { description: 'Shirt measurements' })
  @ValidateNested()
  readonly Shirt: ShirtInput;

  @Field(() => CapInput, { nullable: true, description: 'Cap measurements' })
  @ValidateNested({ each: true })
  readonly Cap: CapInput;

  @Field(() => AgbadaInput, {
    nullable: true,
    description: 'Agbada measurements',
  })
  @ValidateNested({ each: true })
  readonly Agbada: AgbadaInput;
}

@InputType()
export class CreateMeasurementInput {
  @Field(() => [CreateMeasurement], { description: 'SELF Measurement' })
  readonly SELF: CreateMeasurement[];

  @Field(() => [CreateMeasurement], {
    nullable: true,
    description: 'Father Measurement',
  })
  readonly FATHER?: CreateMeasurement[];

  @Field(() => [CreateMeasurement], {
    nullable: true,
    description: 'Brother Measurement',
  })
  readonly BROTHER?: CreateMeasurement[];

  @Field(() => [CreateMeasurement], {
    nullable: true,
    description: 'Son Measurement',
  })
  readonly SON?: CreateMeasurement[];

  @Field(() => [CreateMeasurement], {
    nullable: true,
    description: 'Uncle Measurement',
  })
  readonly UNCLE?: CreateMeasurement[];

  @Field(() => [CreateMeasurement], {
    nullable: true,
    description: 'Grandfather Measurement',
  })
  readonly GRANDFATHER?: CreateMeasurement[];
}

@InputType()
export class FindMeasurementInput {
  @Field(() => String, { description: 'Measurement ID.', nullable: false })
  @IsUUID()
  MeasurementID: string;
}
