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
    private readonly queueService: QueueService,
  ) {}
  async create(createShipmentInput: CreateShipmentInput, req: express.Request) {
    try {
      const [item] = await Promise.all([
        this.ItemModel.findOne({
          ItemID: createShipmentInput.ItemID,
        }).exec(),
      ]);
      if (item) {
        if (item.ItemStatus === ItemStatus.SHIPPED) {
          throw new ConflictException(
            `Item ${createShipmentInput.ItemID} is shipped.`,
          );
        } else if (item.ItemStatus === ItemStatus.COMPLETED) {
          const createdShipment = new this.ShipmentModel({
            Item: item,
            // Vendor: vendor,
            ShipmentID: v4(),
          });
          const shipment = await createdShipment.save();
          this.queueService.QueueJobs(shipment, QueueJobs.SHIPMENTS);
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
    return 'ok';
  }

  async findOne(findShipmentInput: FindShipmentInput, req: express.Request) {
    return 'ok';
  }

  async update(updateShipmentInput: UpdateShipmentInput, req: express.Request) {
    return 'ok';
  }

  async remove(findShipmentInput: FindShipmentInput, req: express.Request) {
    return 'ok';
  }
}
