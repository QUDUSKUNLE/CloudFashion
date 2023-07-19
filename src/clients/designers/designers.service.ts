import * as express from 'express';
import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User, UserDocument } from '../users/models/user.schema';
import { CreateDesignerInput } from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';
import { UserRole } from '../../common/interface';
import { Designer, DesignerDocument } from './models/designers.schema';
import { RedisCacheService } from '../../services/redis-cache/redis-cache.service';

@Injectable()
export class DesignersService {
  constructor(
    @InjectModel(Designer.name) private DesignerModel: Model<DesignerDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly RedisService: RedisCacheService,
  ) {}
  async create(createDesignerInput: CreateDesignerInput, req: express.Request) {
    try {
      if (req.sub.Roles.includes(createDesignerInput.Role))
        throw new BadRequestException('User already a designer.');
      req.sub.Roles.push(createDesignerInput.Role);
      const designer = new this.DesignerModel({
        ...createDesignerInput,
        UserID: req.sub.UserID,
        DesignerID: v4(),
      });
      const [updatedUser, result] = await Promise.all([
        this.UserModel.findOneAndUpdate(
          { UserID: req.sub.UserID },
          { $set: { Roles: req.sub.Roles } },
          { new: true },
        ).select({ Password: 0 }),
        designer.save(),
      ]);
      await this.RedisService.set(updatedUser.UserID, updatedUser);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.DesignerModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(DesignerID: string, req: express.Request) {
    const designer = await this.DesignerModel.findOne({
      DesignerID,
      UserID: req.sub.UserID,
    }).exec();
    if (designer) return designer;
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }

  async update(updateDesignerInput: UpdateDesignerInput, req: express.Request) {
    return await this.DesignerModel.findOneAndUpdate(
      { DesignerID: updateDesignerInput.DesignerID, UserID: req.sub.UserID },
      {
        ...updateDesignerInput,
      },
      {
        new: true,
      },
    ).exec();
  }

  async remove(DesignerID: string, req: express.Request) {
    const designer = await this.DesignerModel.findOne({
      DesignerID,
      UserID: req.sub.UserID,
    }).exec();
    if (designer) {
      const index = req.sub.Roles.indexOf(UserRole.DESIGNER);
      req.sub.Roles.splice(index);
      const [, result] = await Promise.all([
        this.UserModel.findOneAndUpdate(
          {
            UserID: req.sub.UserID,
          },
          { Roles: req.sub.Roles },
        ),
        this.DesignerModel.findOneAndDelete(
          { DesignerID, UserID: req.sub.UserID },
          { rawResult: true },
        ).exec(),
      ]);
      return result;
    }
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }
}
