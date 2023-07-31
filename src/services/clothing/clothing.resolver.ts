import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { Role } from '../../common/interface';
import { GraphRequest, Roles } from '../../common/user.decorator';
import { ClothingService } from './clothing.service';
import {
  CreateClothingInput,
  FindClothingInput,
} from './dto/create-clothing.input';
import { UpdateClothingInput } from './dto/update-clothing.input';
import { Clothing, ClothsPayload } from './models/clothing.schema';

@Resolver()
export class ClothingResolver {
  constructor(private readonly clothingService: ClothingService) {}

  @Roles(Role.USER)
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

  @Roles(Role.USER)
  @Query(() => [ClothsPayload], { name: 'GetClothsRequest' })
  findAll(@GraphRequest() req: express.Request) {
    return this.clothingService.findAll(req);
  }

  @Roles(Role.USER)
  @Query(() => ClothsPayload, { name: 'GetClothRequest' })
  findOne(
    @Args('findClothingInput', { type: () => FindClothingInput })
    findClothingInput: FindClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.findOne(findClothingInput, req);
  }

  @Roles(Role.USER)
  @Mutation(() => Clothing, { name: 'UpdateClothRequest' })
  updateClothing(
    @Args('updateClothingInput', { type: () => UpdateClothingInput })
    updateClothingInput: UpdateClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.update(updateClothingInput, req);
  }

  @Roles(Role.USER)
  @Mutation(() => Clothing, { name: 'DeleteClothRequest' })
  removeClothing(
    @Args('findClothingInput', { type: () => FindClothingInput })
    findClothingInput: FindClothingInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.clothingService.remove(findClothingInput, req);
  }
}
