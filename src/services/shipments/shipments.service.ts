import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import { Model } from 'mongoose';
import { v4 } from 'uuid';

import { ItemStatus } from '../../common/interface';
import {
  Vendor,
  VendorDocument,
} from '../../clients/vendors/models/vendor.schema';
import { Item, ItemDocument } from '../orders/models/orders.schema';
import { QueueJobs } from '../queue/queue.enums';
import { QueueService } from '../queue/queue.service';
import {
  CreateShipmentInput,
  FindShipmentInput,
} from './dto/create-shipment.input';
import { UpdateShipmentInput } from './dto/update-shipment.input';
import { Shipment, ShipmentDocument } from './models/shipments.schema';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectModel(Item.name) private ItemModel: Model<ItemDocument>,
    @InjectModel(Shipment.name) private ShipmentModel: Model<ShipmentDocument>,
    @InjectModel(Vendor.name) private VendorModel: Model<VendorDocument>,
    private readonly queueService: QueueService,
  ) {}
  async create(createShipmentInput: CreateShipmentInput, req: express.Request) {
    try {
      const [item, vendor] = await Promise.all([
        this.ItemModel.findOne({
          ItemID: createShipmentInput.ItemID,
        }).exec(),
        this.VendorModel.findOne({ UserID: req.sub.UserID }).exec(),
      ]);
      if (item && vendor) {
        if (item.ItemStatus === ItemStatus.SHIPPED) {
          throw new ConflictException(
            `Item ${createShipmentInput.ItemID} is shipped.`,
          );
        } else if (item.ItemStatus === ItemStatus.COMPLETED) {
          const createdShipment = new this.ShipmentModel({
            Item: item,
            Vendor: vendor,
            ShipmentID: v4(),
          });
          const shipment = await createdShipment.save();
          this.queueService.queueJobs(shipment, QueueJobs.SHIPMENTS);
          return shipment;
        } else {
          throw new UnprocessableEntityException();
        }
      }
      throw new NotFoundException(
        `Item ${createShipmentInput.ItemID} with ${createShipmentInput.OrderID} not found.`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      UserID: req.sub.UserID,
    }).exec();
    return vendor
      ? await this.ShipmentModel.find({
          VendorID: vendor.VendorID,
        }).exec()
      : [];
  }

  async findOne(findShipmentInput: FindShipmentInput, req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      UserID: req.sub.UserID,
    }).exec();
    return vendor
      ? await this.ShipmentModel.findOne({
          ShipmentID: findShipmentInput.ShipmentID,
          Vendor: vendor,
        }).exec()
      : {};
  }

  async update(updateShipmentInput: UpdateShipmentInput, req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      UserID: req.sub.UserID,
    }).exec();
    return await this.ShipmentModel.findOneAndUpdate(
      {
        ShipmentID: updateShipmentInput.ShipmentID,
        Vendor: vendor,
      },
      {
        ...updateShipmentInput,
      },
      {
        new: true,
      },
    ).exec();
  }

  async remove(findShipmentInput: FindShipmentInput, req: express.Request) {
    const vendor = await this.VendorModel.findOne({
      UserID: req.sub.UserID,
    }).exec();
    return await this.ShipmentModel.findOneAndDelete({
      ShipmentID: findShipmentInput.ShipmentID,
      Vendor: vendor,
    }).exec();
  }
}
