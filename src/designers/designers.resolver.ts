import * as express from 'express';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DesignersService } from './designers.service';
import {
  CreateDesignerInput,
  FindDesignerInput,
} from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';
import { Designer } from './models/designers.schema';
import { FetchArgs, GraphRequest, Roles, Role } from '../common';

@Resolver()
export class DesignersResolver {
  constructor(private readonly designersService: DesignersService) {}

  @Roles(Role.USER)
  @Mutation(() => Designer, { name: 'CreateDesignerProfile' })
  async CreateDesigner(
    @Args('createDesignerInput', { type: () => CreateDesignerInput })
    createDesignerInput: CreateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    try {
      if (createDesignerInput.Role !== Role.DESIGNER) {
        throw new BadRequestException(
          `Invalid Role: ${createDesignerInput.Role}`,
        );
      }
      if (req.sub.Roles.includes(createDesignerInput.Role)) {
        throw new ConflictException('User`s already a designer.');
      }
      req.sub.Roles.push(createDesignerInput.Role);
      return await this.designersService.Create(createDesignerInput, req);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException(e?.message);
      }
      throw e;
    }
  }

  @Roles(Role.ADMIN)
  @Query(() => [Designer], { name: 'GetDesignersProfile' })
  FindAll(@Args() fetchArgs: FetchArgs) {
    return this.designersService.FindAll(fetchArgs);
  }

  @Roles(Role.DESIGNER)
  @Query(() => Designer, { name: 'GetDesigner' })
  FindOne(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.FindOne(findDesignerInput.DesignerID, req);
  }

  @Roles(Role.DESIGNER)
  @Mutation(() => Designer, { name: 'UpdateDesignerProfile' })
  UpdateDesigner(
    @Args('updateDesignerInput', { type: () => UpdateDesignerInput })
    updateDesignerInput: UpdateDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.Update(updateDesignerInput, req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Designer, { name: 'DeleteDesignerProfile' })
  RemoveDesigner(
    @Args('findDesignerInput', { type: () => FindDesignerInput })
    findDesignerInput: FindDesignerInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.designersService.Remove(findDesignerInput.DesignerID, req);
  }
}
