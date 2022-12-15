import { CreateVendorInput } from './create-vendor.input';
import { InputType, PartialType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateVendorInput extends PartialType(CreateVendorInput) {
  @Field(() => String, { nullable: false, description: 'Vendor ID.' })
  @IsUUID()
  VendorID: string;
}
