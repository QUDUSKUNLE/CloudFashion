import * as express from 'express';
import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRole } from 'src/common/interface';
import { User, UserDocument } from '../users/models/user.schema';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';
import { Vendor, VendorDocument } from './models/vendor.schema';
import { RedisCacheService } from '../../services/redis-cache/redis-cache.service';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name) private VendorModel: Model<VendorDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly RedisService: RedisCacheService,
  ) {}

  async create(createVendorInput: CreateVendorInput, req: express.Request) {
    try {
      if (req.sub.Roles.includes(createVendorInput.Role))
        throw new ConflictException('User already a vendor.');
      req.sub.Roles.push(createVendorInput.Role);
      const vendor = new this.VendorModel({
        ...createVendorInput,
        VendorID: v4(),
        UserID: req.sub.UserID,
      });
      const [updatedUser, result] = await Promise.all([
        this.UserModel.findOneAndUpdate(
          { UserID: req.sub.UserID },
          { $set: { Roles: req.sub.Roles } },
          { new: true },
        ).select({ Password: 0 }),
        vendor.save(),
      ]);
      await this.RedisService.set(updatedUser.UserID, updatedUser);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.VendorModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async findOne(VendorID: string, req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      VendorID,
      UserID: req.sub.UserID,
    });
    if (vendor) return vendor;
    throw new NotFoundException(`Vendor ${VendorID} not found.`);
  }

  async update(updateVendorInput: UpdateVendorInput, req: express.Request) {
    return await this.VendorModel.findOneAndUpdate(
      { VendorID: updateVendorInput.VendorID, UserID: req.sub.UserID },
      {
        ...updateVendorInput,
      },
      {
        new: true,
      },
    ).exec();
  }

  async remove(VendorID: string, req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      VendorID,
      UserID: req.sub.UserID,
    }).exec();
    if (vendor) {
      const index = req.sub.Roles.indexOf(UserRole.VENDOR);
      req.sub.Roles.splice(index);
      const [, result] = await Promise.all([
        this.UserModel.findOneAndUpdate(
          {
            UserID: req.sub.UserID,
          },
          {
            Roles: req.sub.Roles,
          },
        ),
        this.VendorModel.findOneAndDelete(
          { VendorID },
          { rawResult: true },
        ).exec(),
      ]);
      return result;
    }
    throw new NotFoundException(`Vendor ${VendorID} not found.`);
  }
}
