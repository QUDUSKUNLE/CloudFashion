import * as express from 'express';
import { v4 } from 'uuid';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';

import { QueueJobs } from '../queue/queue.enums';
import { QueueService } from '../queue/queue.service';
import { Payment, PaymentDocument } from './models/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private PaymentModel: Model<PaymentDocument>,
    private readonly queueService: QueueService,
  ) {}
  async create(createPaymentInput: CreatePaymentInput, req: express.Request) {
    try {
      const instance = new this.PaymentModel({
        ...createPaymentInput,
        UserID: req.sub.UserID,
        PaymentID: v4(),
      });
      const payment = await instance.save();
      this.queueService.queueJobs(payment, QueueJobs.PAYMENTS);
      return payment;
    } catch (error) {
      throw error;
    }
  }

  async findAll(req: express.Request) {
    return await this.PaymentModel.find({ UserID: req.sub.UserID }).exec();
  }

  async findOne(PaymentID: string, req: express.Request) {
    return await this.PaymentModel.findOne({
      PaymentID,
      UserID: req.sub.UserID,
    }).exec();
  }

  async update(updatePaymentInput: UpdatePaymentInput, req: express.Request) {
    return await this.PaymentModel.findOneAndUpdate(
      {
        PaymentID: updatePaymentInput.PaymentID,
        UserID: req.sub.UserID,
      },
      { ...updatePaymentInput },
      { new: true },
    ).exec();
  }

  async remove(PaymentID: string, req: express.Request) {
    return await this.PaymentModel.findOneAndDelete(
      {
        PaymentID,
        UserID: req.sub.UserID,
      },
      { rawResult: true },
    ).exec();
  }
}
