import * as express from 'express';
import { Prisma } from '@prisma/client';
import {
  forwardRef,
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
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
  @Mutation(() => User, { name: 'CreateUserProfile' })
  async createUser(
    @Args('createUserInput', { type: () => CreateUserInput })
    createUserInput: CreateUserInput,
  ) {
    try {
      if (createUserInput.Password !== createUserInput.ConfirmPassword)
        throw new BadRequestException('Bad Request');
      return await this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('User`s already exist.');
        throw error;
      }
    }
  }

  @Roles(UserRole.PUBLIC)
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

  @Roles(UserRole.USER)
  @Mutation(() => LogoutResponse, { name: 'LogOutUser' })
  logout() {
    return this.authService.logOutUser();
  }

  @Roles(UserRole.ADMIN)
  @Query(() => [User], { name: 'GetUsersProfile' })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.USER)
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

  @Roles(UserRole.USER)
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

  @Roles(UserRole.ADMIN)
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
