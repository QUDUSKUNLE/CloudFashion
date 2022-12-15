import * as express from 'express';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'src/common/interface';
import { GraphRequest, Roles } from 'src/user.decorator';
import { AuthService } from '../../services/auth/auth.service';
import {
  CreateUserInput,
  FindUserInput,
  LogInUserInput,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, LoginResponse, LogoutResponse } from './models/user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
@Injectable()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Roles(UserRole.PUBLIC)
  @Mutation(() => User, { name: 'CreateAUserProfile' })
  createUser(
    @Args('createUserInput', { type: () => CreateUserInput })
    createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @Roles(UserRole.PUBLIC)
  @Mutation(() => LoginResponse, { name: 'LogInAUser' })
  async login(
    @Args('logInUserInput', { type: () => LogInUserInput })
    logInUserInput: LogInUserInput,
  ) {
    return await this.authService.validateUser(
      logInUserInput.Email,
      logInUserInput.Password,
    );
  }

  @Roles(UserRole.USER)
  @Mutation(() => LogoutResponse, { name: 'LogOutAUser' })
  logout() {
    return this.authService.logOutUser();
  }

  @Roles(UserRole.ADMIN)
  @Query(() => [User], { name: 'GetUsersProfile' })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.USER)
  @Query(() => User, { name: 'GetAUserProfile' })
  findOne(
    @Args('findUserInput', { type: () => FindUserInput })
    findUserInput: FindUserInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.usersService.findOne(findUserInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => User, { name: 'UpdateAUserProfile' })
  updateOne(
    @Args('updateUserInput', { type: () => UpdateUserInput })
    updateUserInput: UpdateUserInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.usersService.updateOne(updateUserInput, req);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => User, { name: 'DeleteAUserProfile' })
  removeOne(
    @Args('findUserInput', { type: () => FindUserInput })
    findUserInput: FindUserInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.usersService.deleteOne(findUserInput, req);
  }
}
