import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Vendor {
  @Field(() => String, { description: 'Vendor message', nullable: true })
  VendorMessage: string;
}
