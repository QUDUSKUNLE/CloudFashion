import * as express from 'express';
import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ItemStatus } from '../../common/interface';
import { QueueJobs } from '../queue/queue.enums';
import { QueueService } from '../queue/queue.service';
import { Payment, PaymentDocument } from '../payments/models/payment.schema';
import { CreateOrderInput, FindOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import {
  Order,
  AOrder,
  Item,
  ItemDocument,
  OrderDocument,
} from './models/orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private OrderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private PaymentModel: Model<PaymentDocument>,
    @InjectModel(Item.name) private ItemModel: Model<ItemDocument>,
    private readonly queueService: QueueService,
  ) {}
  async create(createOrderInput: CreateOrderInput, req: express.Request) {
    try {
      const createdPayment = new this.PaymentModel({
        PaymentAmount: createOrderInput.Payments.Amount,
        PaymentTrackingID: createOrderInput.PaymentTrackingID,
        UserID: req.sub.UserID,
        PaymentID: v4(),
      });
      const Payment = await createdPayment.save();
      if (Payment) {
        const createdOrder = new this.OrderModel({
          OrderAddress: createOrderInput.OrderAddress,
          OrderID: v4(),
          PaymentID: Payment.PaymentID,
          UserID: req.sub.UserID,
        });
        const Order = await createdOrder.save();
        this.queueService.QueueJobs(
          {
            ...createOrderInput,
            user: req.sub,
            Payment,
            order: Order,
          },
          QueueJobs.ORDERS,
        );
        return {
          OrderMessage: 'Order submitted successfully.',
          OrderStatus: ItemStatus.PROCESSING,
          OrderID: Order.OrderID,
        };
      }
      throw new UnprocessableEntityException(
        `Order not processable, \'PaymentID\' required not found.`,
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(req: express.Request) {
    try {
      return await this.OrderModel.aggregate([
        { $match: { UserID: req.sub.UserID } },
      ]).lookup({
        from: 'items',
        localField: 'Items',
        foreignField: 'ItemID',
        as: 'OrderItems',
      });
    } catch (error) {
      throw error;
    }
  }

  async findOrder(
    findOrderInput: FindOrderInput,
    req: express.Request,
  ): Promise<AOrder> {
    try {
      const order = await this.OrderModel.findOne({
        OrderID: findOrderInput.OrderID,
        UserID: req.sub.UserID,
      }).exec();
      if (order) {
        const items = await this.ItemModel.find({
          ItemID: { $in: order.Items },
        }).lean();
        const { OrderID, ...Others } = order;
        return {
          OrderID,
          ...Others,
          OrderItems: items,
        };
      }
      throw new NotFoundException(`Order ${findOrderInput.OrderID} not found.`);
    } catch (error) {
      throw error;
    }
  }

  async update(updateOrderInput: UpdateOrderInput, req: express.Request) {
    try {
      return await this.OrderModel.findOneAndUpdate(
        {
          OrderID: updateOrderInput.OrderID,
          UserID: req.sub.UserID,
        },
        {
          ...updateOrderInput,
        },
        {
          new: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async remove(findOrderInput: FindOrderInput, req: express.Request) {
    return await this.OrderModel.findOneAndDelete({
      OrderID: findOrderInput.OrderID,
      UserID: req.sub.UserID,
    });
  }
}
