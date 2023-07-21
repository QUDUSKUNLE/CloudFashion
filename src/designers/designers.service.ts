import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { Role } from '../common/interface';
import { RedisCacheService } from '../services/redis-cache/redis-cache.service';
import { CreateDesignerInput } from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';
import { PrismaService } from '../prisma/prisma.service';
import { Designer, DesignerDocument } from './models/designers.schema';

@Injectable()
export class DesignersService {
  constructor(
    @InjectModel(Designer.name) private DesignerModel: Model<DesignerDocument>,
    private readonly prismaService: PrismaService,
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
      const result = designer.save();
      // await this.RedisService.set(updatedUser.UserID, updatedUser);
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
      const index = req.sub.Roles.indexOf(Role.DESIGNER);
      req.sub.Roles.splice(index);
      return 'ok';
    }
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }
}
