import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { ItemStatus } from 'src/common/interface';
import { v4 } from 'uuid';
import {
  Item,
  ItemDocument,
  Order,
  OrderDocument,
} from '../orders/models/orders.schema';
import { PrismaService } from '../../prisma/prisma.service';
import { YoutubeService } from '../youtube/youtube.service';
import { QueueJobs } from './queue.enums';

@Processor('halalmarket')
@Injectable()
export class HalalMarketConsumer {
  progress = 0;
  constructor(
    @InjectModel(Item.name) private ItemModel: Model<ItemDocument>,
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    private readonly cloudinaryService: YoutubeService,
    private readonly prismaService: PrismaService,
  ) {}

  @Process(QueueJobs.PRODUCTS)
  async Products(job: Job) {
    this.progress += 1;
    const result = await this.processProductJobs(job);
    job.progress(this.progress);
    return result;
  }

  @Process(QueueJobs.ORDERS)
  async Orders(job: Job) {
    this.progress += 1;
    const result = await this.processOrderJobs(job);
    job.progress(this.progress);
    return result;
  }

  @Process(QueueJobs.PAYMENTS)
  async Payments(job: Job) {
    this.progress += 1;
    const result = await this.processPaymentJobs(job);
    job.progress(this.progress);
    return result;
  }

  @Process(QueueJobs.ITEMS)
  async Items(job: Job) {
    this.progress += 1;
    const result = await this.processItemJobs(job);
    job.progress(this.progress);
    return result;
  }

  @Process(QueueJobs.SHIPMENTS)
  async Shipments(job: Job) {
    this.progress += 1;
    const result = await this.processShipmentJobs(job);
    job.progress(this.progress);
    return result;
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: unknown) {
    Logger.log(
      `Completed job ${job.id} of type ${job.name} ${JSON.stringify(result)}.`,
    );
  }

  processItemJobs = async (job: Job): Promise<string> => {
    const { data } = job;
    const item = await this.ItemModel.findOne({ ItemID: data.ItemID }).exec();
    if (item.ItemStatus !== data.ItemStatus) {
      item.ItemStatus = data.ItemStatus;
      await item.save();
    }
    return 'Done';
  };

  processShipmentJobs = async (job: Job): Promise<string> => {
    const { data } = job;
    await this.ItemModel.findOneAndUpdate(
      {
        ItemID: data.shipemnt.Item.ItemID,
      },
      { $set: { ItemStatus: ItemStatus.SHIPPED } },
    ).exec();
    return 'Done';
  };

  processProductJobs = async (job: Job): Promise<string> => {
    const { data } = job;
    const { secure_url } = await this.cloudinaryService.uploadToCloud(
      data.filePath,
    );
    await this.prismaService.products.update({
      where: { ProductID: data.ProductID },
      data: { ProductVideo: secure_url as string },
    });
    fs.unlink(data.filePath, (error) => {
      if (error) throw error;
    });
    return 'Done';
  };

  processPaymentJobs = async (job: Job): Promise<string> => {
    const { data } = job;
    await this.OrderModel.findOneAndUpdate(
      { OrderID: data.Order.OrderID },
      { $set: { Payment: data } },
    ).exec();
    return 'Done';
  };

  processOrderJobs = async (job: Job): Promise<string> => {
    const { data } = job;
    const Items: string[] = [];
    let [toTalDiscount, OrderAmount] = [0, 0];
    for (const orderDetail of data.OrderDetails) {
      const product = await this.prismaService.products.findUnique({
        where: { ProductID: orderDetail.ProductID },
      });
      if (product) {
        product.ProductQuantity -= orderDetail.Count;
        toTalDiscount += 0;
        let item = new this.ItemModel({
          ItemID: v4(),
          ItemCount: orderDetail.Count,
          ItemTotalCost: orderDetail.Count * product.ProductPrice,
          ItemStatus: ItemStatus.PROCESSING,
          OrderID: data.order.OrderID,
          ProductID: product.ProductID,
          Statuses: [
            { ItemStatus: ItemStatus.PROCESSING, DateTime: new Date() },
          ],
        });
        item = await item.save();
        OrderAmount += item.ItemTotalCost;
        Items.push(item.ItemID);
      }
    }
    if (Items.length > 0) {
      await this.OrderModel.findOneAndUpdate(
        { OrderID: data.order.OrderID },
        {
          $set: {
            OrderDiscount: toTalDiscount,
            OrderAmount,
            Items,
          },
        },
      ).exec();
    }
    return 'Done';
  };
}
