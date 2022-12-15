import * as express from 'express';
import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'src/common/interface';
import { GraphRequest, Roles } from 'src/user.decorator';
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

  @Roles(UserRole.USER)
  @Mutation(() => Designer, { name: 'CreateADesignerProfile' })
  createDesigner(
    @Args('createDesignerInput', { type: () => CreateDesignerInput })
    createDesignerInput: CreateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    if (createDesignerInput.Role !== UserRole.DESIGNER)
      throw new BadRequestException(
        `Invalid Role: ${createDesignerInput.Role}`,
      );
    return this.designersService.create(createDesignerInput, req);
  }

  @Roles(UserRole.DESIGNER)
  @Query(() => [Designer], { name: 'GetDesignersProfile' })
  findAll() {
    return this.designersService.findAll();
  }

  @Roles(UserRole.DESIGNER)
  @Query(() => Designer, { name: 'GetADesigner' })
  findOne(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.findOne(findDesignerInput.DesignerID, req);
  }

  @Roles(UserRole.DESIGNER)
  @Mutation(() => Designer, { name: 'UpdateADesignerProfile' })
  updateDesigner(
    @Args('updateDesignerInput', { type: () => UpdateDesignerInput })
    updateDesignerInput: UpdateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.update(updateDesignerInput, req);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Designer, { name: 'DeleteADesignerProfile' })
  removeDesigner(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.remove(findDesignerInput.DesignerID, req);
  }
}
