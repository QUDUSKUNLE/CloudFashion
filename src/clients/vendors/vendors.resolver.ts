import * as express from 'express';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'src/common/interface';
import { GraphRequest, Roles } from 'src/user.decorator';
import { CreateVendorInput, FindVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { Vendor } from './models/vendor.schema';
import { VendorsService } from './vendors.service';

@Resolver()
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Roles(UserRole.USER)
  @Mutation(() => Vendor, { name: 'CreateAVendorProfile' })
  createVendor(
    @Args('createVendorInput', { type: () => CreateVendorInput })
    createVendorInput: CreateVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.create(createVendorInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Query(() => [Vendor], { name: 'GetVendorsProfile' })
  findAll() {
    return this.vendorsService.findAll();
  }

  @Roles(UserRole.VENDOR)
  @Query(() => Vendor, { name: 'GetAVendorProfile' })
  findOne(
    @Args('findVendorInput', { type: () => FindVendorInput })
    findVendorInput: FindVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.findOne(findVendorInput.VendorID, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => String, { name: 'UpdateAVendorProfile' })
  updateVendor(
    @Args('updateVendorInput', { type: () => UpdateVendorInput })
    updateVendorInput: UpdateVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.update(updateVendorInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Vendor, { name: 'DeleteAVendorProfile' })
  removeVendor(
    @Args('findVendorInput', { type: () => FindVendorInput })
    findVendorInput: FindVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.remove(findVendorInput.VendorID, req);
  }
}
