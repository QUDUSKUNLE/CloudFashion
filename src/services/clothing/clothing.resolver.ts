import * as express from 'express';
import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
import { ClothingService } from './clothing.service';
import {
  CreateClothingInput,
  FindClothingInput,
} from './dto/create-clothing.input';
import {
  CreateMeasurementInput,
  FindMeasurementInput,
} from './dto/create-measurement.input';
import { UpdateClothingInput } from './dto/update-clothing.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';
import { Clothing, Measurement, ClothsPayload } from './models/clothing.schema';

@Resolver()
export class ClothingResolver {
  constructor(private readonly clothingService: ClothingService) {}

  @Roles(UserRole.USER)
  @Mutation(() => ClothsPayload, { name: 'CreateClothRequest' })
  createClothing(
    @Args('createClothingInput', { type: () => CreateClothingInput })
    createClothingInput: CreateClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    if (Object.keys(createClothingInput).length === 0)
      throw new BadRequestException(`No action submitted.`);
    return this.clothingService.create(createClothingInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Measurement, { name: 'CreateMeasurement' })
  createMeasurement(
    @Args('createMeasurementInput', { type: () => CreateMeasurementInput })
    createMeasurementInput: CreateMeasurementInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.createMeasurement(createMeasurementInput, req);
  }

  @Roles(UserRole.USER)
  @Query(() => [ClothsPayload], { name: 'GetClothsRequest' })
  findAll(@GraphRequest() req: express.Request) {
    return this.clothingService.findAll(req);
  }

  @Roles(UserRole.USER)
  @Query(() => [Measurement], { name: 'GetMeasurements' })
  findAllMeasurement(@GraphRequest() req: express.Request) {
    return this.clothingService.findAllMeasurement(req);
  }

  @Roles(UserRole.USER)
  @Query(() => ClothsPayload, { name: 'GetClothRequest' })
  findOne(
    @Args('findClothingInput', { type: () => FindClothingInput })
    findClothingInput: FindClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.findOne(findClothingInput, req);
  }

  @Roles(UserRole.USER)
  @Query(() => Measurement, { name: 'GetMeasurement' })
  findOneMeasurement(
    @Args('findMeasurementInput', { type: () => FindMeasurementInput })
    findMeasurementInput: FindMeasurementInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.findOneMeasurement(findMeasurementInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Clothing, { name: 'UpdateClothRequest' })
  updateClothing(
    @Args('updateClothingInput', { type: () => UpdateClothingInput })
    updateClothingInput: UpdateClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.update(updateClothingInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Measurement, { name: 'UpdateMeasurement' })
  updateMeasurement(
    @Args('updateMeasurementInput', { type: () => UpdateMeasurementInput })
    updateMeasurementInput: UpdateMeasurementInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.updateMeasurement(updateMeasurementInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Clothing, { name: 'DeleteClothRequest' })
  removeClothing(
    @Args('findClothingInput', { type: () => FindClothingInput })
    findClothingInput: FindClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.remove(findClothingInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Measurement, { name: 'DeleteMeasurement' })
  removeMeasurement(
    @Args('findMeasurementInput', { type: () => FindMeasurementInput })
    findMeasurementInput: FindMeasurementInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.removeMeasurement(findMeasurementInput, req);
  }
}
