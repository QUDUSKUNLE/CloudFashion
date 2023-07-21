import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { Role } from '../common/interface';
import { GraphRequest, Roles } from '../user.decorator';
import { DesignersService } from './designers.service';
import {
    CreateDesignerInput,
    FindDesignerInput,
} from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';
import { Designer } from './models/designers.schema';

@Resolver()
export class DesignersResolver {
  constructor(private readonly designersService: DesignersService) {}

  @Roles(Role.USER)
  @Mutation(() => Designer, { name: 'CreateDesignerProfile' })
  createDesigner(
    @Args('createDesignerInput', { type: () => CreateDesignerInput })
    createDesignerInput: CreateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    if (createDesignerInput.Role !== Role.DESIGNER)
      throw new BadRequestException(
        `Invalid Role: ${createDesignerInput.Role}`,
      );
    return this.designersService.create(createDesignerInput, req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Designer], { name: 'GetDesignersProfile' })
  findAll() {
    return this.designersService.findAll();
  }

  @Roles(Role.DESIGNER)
  @Query(() => Designer, { name: 'GetDesigner' })
  findOne(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.findOne(findDesignerInput.DesignerID, req);
  }

  @Roles(Role.DESIGNER)
  @Mutation(() => Designer, { name: 'UpdateDesignerProfile' })
  updateDesigner(
    @Args('updateDesignerInput', { type: () => UpdateDesignerInput })
    updateDesignerInput: UpdateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.update(updateDesignerInput, req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Designer, { name: 'DeleteDesignerProfile' })
  removeDesigner(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.remove(findDesignerInput.DesignerID, req);
  }
}
