import * as express from 'express';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput, FindUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async create(createUserInput: CreateUserInput) {
    try {
      const createdUser = new this.UserModel({
        ...createUserInput,
        UserID: v4(),
      });
      return await createdUser.save();
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  async findAll() {
    return await this.UserModel.find().exec();
  }

  async findOne(
    findUserInput: FindUserInput,
    req: express.Request,
  ): Promise<User> {
    if (findUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return await this.UserModel.findOne({
      UserID: findUserInput.UserID,
    }).exec();
  }

  async updateOne(
    updateUserInput: UpdateUserInput,
    req: express.Request,
  ): Promise<User> {
    if (updateUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return await this.UserModel.findOneAndUpdate(
      { UserID: updateUserInput.UserID },
      {
        ...updateUserInput,
      },
      { new: true },
    ).exec();
  }

  async deleteOne(findUserInput: FindUserInput, req: express.Request) {
    if (findUserInput.UserID !== req.sub.UserID)
      throw new UnauthorizedException('Unauthorized.');
    return await this.UserModel.findOneAndDelete(
      {
        UserID: findUserInput.UserID,
      },
      { rawResult: true },
    ).exec();
  }
}
