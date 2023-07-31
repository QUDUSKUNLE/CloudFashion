import {
  Field,
  Float,
  InputType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import {
  ButtonType,
  ColarNeckType,
  DesignType,
  LinkType,
  Measurement,
  PucketType,
  WaistTightType,
  MeasurementTypes,
} from '../interface/measurement.interface';

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
  @IsEnum(LinkType)
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
  readonly Shirt?: ShirtInput;

  @Field(() => CapInput, { nullable: true, description: 'Cap measurements' })
  @ValidateNested({ each: true })
  readonly Cap?: CapInput;

  @Field(() => AgbadaInput, {
    nullable: true,
    description: 'Agbada measurements',
  })
  @ValidateNested({ each: true })
  readonly Agbada?: AgbadaInput;
}

@InputType()
export class CreateMeasurementInput {
  @Field(() => CreateMeasurement, { description: 'Measurement' })
  Measurement: CreateMeasurement;

  @Field(() => MeasurementTypes, { description: 'Measurement Type' })
  @IsEnum(MeasurementTypes)
  MeasurementType: MeasurementTypes;
}

@InputType()
export class FindMeasurementInput {
  @Field(() => String, { description: 'Measurement ID.', nullable: false })
  MeasurementID: string;
}

registerEnumType(Measurement, {
  name: 'MeasurementUnit',
  description: 'Measurement unit',
});

registerEnumType(PucketType, {
  name: 'PucketType',
  description: 'Pucket type',
});

registerEnumType(WaistTightType, {
  name: 'WaistTightType',
  description: 'Waist tighening type',
});

registerEnumType(ButtonType, {
  name: 'ButtonType',
  description: 'Button type',
});

registerEnumType(DesignType, {
  name: 'DesignType',
  description: 'Shirt Design Type',
});

registerEnumType(ColarNeckType, {
  name: 'ColarNeckType',
  description: 'Shirt Collar Neck Type',
});

registerEnumType(LinkType, {
  name: 'LinkType',
  description: 'Arm Link Type',
});

registerEnumType(MeasurementTypes, {
  name: 'MeasurementTypes',
  description: 'Measurement type',
});
