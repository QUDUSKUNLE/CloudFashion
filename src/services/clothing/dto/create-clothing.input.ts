import { IsUUID, ValidateNested, Validate, ValidateIf } from 'class-validator';
import { InputType, Field, OmitType, registerEnumType } from '@nestjs/graphql';
import {
  RequestActions,
  MeasurementType,
  Measurement,
  PucketType,
  WaistTightType,
  ButtonType,
  DesignType,
  ColarNeckType,
  LinkType,
} from '../interface/interface';
import {
  CustomPickUpDateValidator,
  CustomDeliveryDateValidator,
} from '../helper/validation';
import { Address } from '../../../common/address.input';

const todaysDate = new Date();

@InputType()
export class PickUpInput {
  @Field(() => Address, {
    description: 'Cloth PickUp Address',
  })
  @ValidateNested()
  PickUpAddress: Address;

  @Field(() => Address, {
    description: 'Cloth Delivery Address',
  })
  @ValidateNested()
  DeliveryAddress: Address;
}

@InputType()
export class ClothPickUpInput {
  @Field(() => PickUpInput, { nullable: true, description: 'SELF PickUpInput' })
  @ValidateNested()
  SELF: PickUpInput;

  @Field(() => PickUpInput, {
    nullable: true,
    description: `${MeasurementType.FATHER} PickUpInput`,
  })
  @ValidateNested()
  FATHER: PickUpInput;

  @Field(() => PickUpInput, {
    nullable: true,
    description: `${MeasurementType.SON} PickUpInput`,
  })
  @ValidateNested()
  SON: PickUpInput;

  @Field(() => PickUpInput, {
    nullable: true,
    description: `${MeasurementType.UNCLE} PickUpInput`,
  })
  UNCLE: PickUpInput;

  @Field(() => PickUpInput, {
    nullable: true,
    description: `${MeasurementType.BROTHER} PickUpInput`,
  })
  BROTHER: PickUpInput;

  @Field(() => PickUpInput, {
    nullable: true,
    description: `${MeasurementType.GRANDFATHER} PickUpInput`,
  })
  GRANDFATHER: PickUpInput;
}

@InputType()
export class ReturnInput extends OmitType(PickUpInput, [
  'DeliveryAddress',
] as const) {
  @Field(() => String, { description: 'Cloth ID' })
  @IsUUID()
  ClothID: string;
}

@InputType()
export class ClothReturnInput {
  @Field(() => ReturnInput, {
    nullable: true,
    description: `SELF ReturnInput`,
  })
  SELF: ReturnInput;

  @Field(() => ReturnInput, {
    nullable: true,
    description: `FATHER ReturnInput`,
  })
  FATHER: ReturnInput;

  @Field(() => ReturnInput, {
    nullable: true,
    description: `SON ReturnInput`,
  })
  SON: ReturnInput;

  @Field(() => ReturnInput, {
    nullable: true,
    description: `UNCLE ReturnInput`,
  })
  UNCLE: ReturnInput;

  @Field(() => ReturnInput, {
    nullable: true,
    description: `BROTHER ReturnInput`,
  })
  BROTHER: ReturnInput;

  @Field(() => ReturnInput, {
    nullable: true,
    description: `GRANDFATHER ReturnInput`,
  })
  GRANDFATHER: ReturnInput;
}

@InputType()
export class CreateClothingInput {
  @Field(() => [ClothPickUpInput], {
    nullable: true,
    description: 'Cloth Pickup Input',
  })
  @ValidateNested()
  ClothToSow: ClothPickUpInput[];

  @Field(() => Date, { description: 'PickUp Date' })
  @Validate(CustomPickUpDateValidator, [new Date()], { always: true })
  PickUpDate: Date;

  @Field(() => Date, { nullable: true, description: 'Delivery Date' })
  @ValidateIf(
    (createCloth: CreateClothingInput) => createCloth.PickUpDate !== undefined,
  )
  @Validate(
    CustomDeliveryDateValidator,
    [todaysDate.setDate(todaysDate.getDate() + 7)],
    { always: true },
  )
  DeliveryDate?: Date;

  @Field(() => [ClothReturnInput], {
    nullable: true,
    description: 'Cloth Return Input',
  })
  ClothToReturn: ClothReturnInput[];

  @Field(() => [ClothReturnInput], {
    nullable: true,
    description: 'Cloth Review Input',
  })
  ClothToReview: ClothReturnInput[];

  @Field(() => [ClothReturnInput], {
    nullable: true,
    description: 'Cloth Complain Input',
  })
  @ValidateNested()
  ClothToComplain: ClothReturnInput[];
}

@InputType()
export class FindClothingInput {
  @Field(() => String, { description: 'Cloth ID.', nullable: false })
  @IsUUID()
  ClothID: string;
}

registerEnumType(RequestActions, {
  name: 'RequestActions',
  description: 'RequestActions',
});

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
