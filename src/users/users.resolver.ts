import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import * as express from 'express';
import { FetchArguments, GraphRequest, Role, Roles } from '../common';
import { AuthService } from '../services/auth/auth.service';
import {
  CreateUserInput,
  FindUserInput,
  LogInUserInput,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginResponse, LogoutResponse, User } from './models/user.schema';
import { UsersService } from './users.service';

@Resolver(() => User)
@Injectable()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Roles(Role.PUBLIC)
  @Mutation(() => User, { name: 'CreateUserProfile' })
  async createUser(
    @Args('createUserInput', { type: () => CreateUserInput })
    createUserInput: CreateUserInput,
  ) {
    try {
      return await this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('User`s already exist.');
        throw error;
      }
      throw error;
    }
  }

  @Roles(Role.PUBLIC)
  @Mutation(() => LoginResponse, { name: 'LogInUser' })
  async login(
    @Args('logInUserInput', { type: () => LogInUserInput })
    logInUserInput: LogInUserInput,
  ) {
    return await this.authService.validateUser(
      logInUserInput.Email,
      logInUserInput.Password,
    );
  }

  @Roles(Role.USER)
  @Mutation(() => LogoutResponse, { name: 'LogOutUser' })
  logout() {
    return this.authService.logOutUser();
  }

  @Roles(Role.PUBLIC)
  @Query(() => [User], { name: 'GetUsersProfile' })
  findAll(@Args() fetch: FetchArguments) {
    return this.usersService.findAll(fetch);
  }

  @Roles(Role.USER)
  @Query(() => User, { name: 'GetUserProfile' })
  async findOne(
    @Args('findUserInput', { type: () => FindUserInput })
    findUserInput: FindUserInput,
    @GraphRequest() req: express.Request,
  ) {
    if (findUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return await this.usersService.findOne(findUserInput);
  }

  @Roles(Role.USER)
  @Mutation(() => User, { name: 'UpdateUserProfile' })
  updateOne(
    @Args('updateUserInput', { type: () => UpdateUserInput })
    updateUserInput: UpdateUserInput,
    @GraphRequest() req: express.Request,
  ) {
    if (updateUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return this.usersService.updateOne(updateUserInput);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => User, { name: 'DeleteUserProfile' })
  removeOne(
    @Args('findUserInput', { type: () => FindUserInput })
    findUserInput: FindUserInput,
    @GraphRequest() req: express.Request,
  ) {
    if (findUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return this.usersService.deleteOne(findUserInput);
  }
}
