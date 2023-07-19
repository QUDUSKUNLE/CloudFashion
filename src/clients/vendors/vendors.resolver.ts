import * as express from 'express';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
import { CreateVendorInput, FindVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { Vendor } from './models/vendor.schema';
import { VendorsService } from './vendors.service';

@Resolver()
export class VendorsResolver {
  constructor(private readonly vendorsService: VendorsService) {}

  @Roles(UserRole.USER)
  @Mutation(() => Vendor, { name: 'CreateVendorProfile' })
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
  @Query(() => Vendor, { name: 'GetVendorProfile' })
  findOne(
    @Args('findVendorInput', { type: () => FindVendorInput })
    findVendorInput: FindVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.findOne(findVendorInput.VendorID, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => String, { name: 'UpdateVendorProfile' })
  updateVendor(
    @Args('updateVendorInput', { type: () => UpdateVendorInput })
    updateVendorInput: UpdateVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.update(updateVendorInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Vendor, { name: 'DeleteVendorProfile' })
  removeVendor(
    @Args('findVendorInput', { type: () => FindVendorInput })
    findVendorInput: FindVendorInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.vendorsService.remove(findVendorInput.VendorID, req);
  }
}
