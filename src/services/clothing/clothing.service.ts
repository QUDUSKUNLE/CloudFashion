import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import {
  CreateClothingInput,
  FindClothingInput,
} from './dto/create-clothing.input';
import { UpdateClothingInput } from './dto/update-clothing.input';
import { Clothing, ClothingDocument } from './models/clothing.schema';

@Injectable()
export class ClothingService {
  constructor(
    @InjectModel(Clothing.name) private ClothingModel: Model<ClothingDocument>,
  ) {}
  async create(createClothingInput: CreateClothingInput, req: express.Request) {
    try {
      const requestPayload = new this.ClothingModel({
        UserID: req.sub.UserID,
        ClothID: v4(),
        ClothRequestPayload: createClothingInput,
      });
      return await requestPayload.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(req: express.Request) {
    return await this.ClothingModel.find({
      UserID: req.sub.UserID,
    }).exec();
  }

  async findOne(findClothingInput: FindClothingInput, req: express.Request) {
    return await this.ClothingModel.findOne({
      ClothID: findClothingInput.ClothID,
      UserID: req.sub.UserID,
    }).exec();
  }

  update(updateClothingInput: UpdateClothingInput, req: express.Request) {
    console.log(updateClothingInput, req);
    return `This action updates a clothing`;
  }

  async remove(findClothingInput: FindClothingInput, req: express.Request) {
    try {
      return await this.ClothingModel.findOneAndDelete(
        {
          ClothID: findClothingInput.ClothID,
          UserID: req.sub.UserID,
        },
        { rawResult: true },
      ).exec();
    } catch (error) {
      throw error;
    }
  }
}
