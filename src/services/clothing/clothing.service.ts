import * as express from 'express';
import { v4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateClothingInput,
  FindClothingInput,
} from './dto/create-clothing.input';
import {
  CreateMeasurementInput,
  FindMeasurementInput,
} from './dto/create-measurement.input';
import { UpdateClothingInput } from './dto/update-clothing.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';
import {
  Clothing,
  ClothingDocument,
  Measurement,
  MeasurementDocument,
} from './models/clothing.schema';

@Injectable()
export class ClothingService {
  constructor(
    @InjectModel(Clothing.name) private ClothingModel: Model<ClothingDocument>,
    @InjectModel(Measurement.name)
    private MeasurementModel: Model<MeasurementDocument>,
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

  async createMeasurement(
    createMeasurementInput: CreateMeasurementInput,
    req: express.Request,
  ) {
    try {
      const measurement = new this.MeasurementModel({
        Measurement: createMeasurementInput,
        UserID: req.sub.UserID,
        MeasurementID: v4(),
      });
      return await measurement.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(req: express.Request) {
    return await this.ClothingModel.find({
      UserID: req.sub.UserID,
    }).exec();
  }

  async findAllMeasurement(req: express.Request) {
    return await this.MeasurementModel.find({
      UserID: req.sub.UserID,
    }).exec();
  }

  async findOne(findClothingInput: FindClothingInput, req: express.Request) {
    return await this.ClothingModel.findOne({
      ClothID: findClothingInput.ClothID,
      UserID: req.sub.UserID,
    }).exec();
  }

  async findOneMeasurement(
    findMeasurementInput: FindMeasurementInput,
    req: express.Request,
  ) {
    return await this.MeasurementModel.findOne({
      MeasurementID: findMeasurementInput.MeasurementID,
      UserID: req.sub.UserID,
    }).exec();
  }

  update(updateClothingInput: UpdateClothingInput, req: express.Request) {
    console.log(updateClothingInput, req);
    return `This action updates a clothing`;
  }

  updateMeasurement(
    updateMeasurementInput: UpdateMeasurementInput,
    req: express.Request,
  ) {
    console.log(updateMeasurementInput, req);
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

  async removeMeasurement(
    findMeasurementInput: FindMeasurementInput,
    req: express.Request,
  ) {
    try {
      const { MeasurementID } = findMeasurementInput;
      const measurement = await this.MeasurementModel.findOne({
        MeasurementID,
        UserID: req.sub.UserID,
      }).exec();
      if (measurement?.MeasurementID)
        return await this.MeasurementModel.findOneAndDelete({
          MeasurementID,
        }).exec();
      throw new NotFoundException(`Measurement not found.`);
    } catch (error) {
      throw error;
    }
  }
}
