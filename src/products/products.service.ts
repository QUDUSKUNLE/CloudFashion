import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { v4 } from 'uuid';
import { UpdateItemInput } from '../services/orders/dto/create-order.input';
import { Item, ItemDocument } from '../services/orders/models/orders.schema';
import { Statuses } from '../products/entities/product.entity';
import { QueueJobs } from '../services/queue/queue.enums';
import { QueueService } from '../services/queue/queue.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product, ProductDocument } from './models/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
    @InjectModel(Item.name) private ItemModel: Model<ItemDocument>,
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}
  async create(createProductInput: CreateProductInput, req: express.Request) {
    let [filePath] = [''];
    try {
      if (createProductInput.ProductVideo) {
        const { createReadStream, filename } =
          await createProductInput.ProductVideo;
        filePath = path.join(process.cwd(), `./src/upload/${v4()}${filename}`);
        new Promise((resolve, reject) =>
          createReadStream()
            .pipe(fs.createWriteStream(filePath))
            .on('finish', () => resolve({ filename }))
            .on('error', () =>
              reject(
                new HttpException(
                  'Could not upload product video.',
                  HttpStatus.BAD_REQUEST,
                ),
              ),
            ),
        );
      }
      const createdProduct = await this.prismaService.products.create({
        data: {
          ProductName: createProductInput.ProductName,
          ProductQuantity: createProductInput.ProductQuantity,
          ProductPrice: createProductInput.ProductPrice,
          ProductCosts:
            createProductInput.ProductPrice *
            createProductInput.ProductQuantity,
          ProductVideo: process.env.TEST_VIDEO,
          CustomerID: createProductInput.CustomerID,
        },
      });
      this.queueService.queueJobs(
        {
          filePath,
          createProductInput,
          ProductID: createdProduct.ProductID,
        },
        QueueJobs.PRODUCTS,
      );
      return '';
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.ProductModel.find({ ProductQuantity: { $gt: 0 } }).exec();
  }

  async find(req: express.Request) {
    return await this.ProductModel.find({ UserID: req.sub.UserID }).exec();
  }

  async updateItemStatus(updateItemStatus: UpdateItemInput) {
    try {
      const item = await this.ItemModel.findOne({
        ItemID: updateItemStatus.ItemID,
      }).exec();
      if (item && item.Statuses) {
        const statuses: Statuses[] = item.Statuses;
        if (
          statuses.some(
            (prev) => prev.ItemStatus === updateItemStatus.ItemStatus,
          )
        ) {
          throw new ConflictException(
            `Item already ${updateItemStatus.ItemStatus}.`,
          );
        }
        statuses.push({
          ItemStatus: updateItemStatus.ItemStatus,
          DateTime: new Date(),
        });
        await this.ItemModel.findOneAndUpdate(
          {
            ItemID: updateItemStatus.ItemID,
          },
          {
            $set: {
              Statuses: statuses,
              ItemStatus: updateItemStatus.ItemStatus,
            },
          },
        ).exec();
        return {
          ItemMessage: 'Item updated.',
          ItemStatus: updateItemStatus.ItemStatus,
          ItemID: updateItemStatus.ItemID,
        };
      }
      throw new NotFoundException('Item not found.');
    } catch (error) {
      throw error;
    }
  }

  async Items(req: express.Request) {
    try {
      return [];
    } catch (error) {
      throw error;
    }
  }

  async findOne(ProductID: string, req: express.Request) {
    return await this.ProductModel.findOne({
      ProductID,
      UserID: req.sub.UserID,
    }).exec();
  }

  async update(updateProductInput: UpdateProductInput, req: express.Request) {
    let [filePath] = [''];
    if (updateProductInput.ProductVideo) {
      const { createReadStream, filename } =
        await updateProductInput.ProductVideo;
      filePath = path.join(process.cwd(), `./src/upload/${v4()}${filename}`);
      new Promise((resolve, reject) =>
        createReadStream()
          .pipe(fs.createWriteStream(filePath))
          .on('finish', () => resolve({ filename }))
          .on('error', () =>
            reject(
              new HttpException(
                'Could not upload product video.',
                HttpStatus.BAD_REQUEST,
              ),
            ),
          ),
      );
    }
    this.queueService.queueJobs(
      {
        filePath,
        updateProductInput,
        ProductID: updateProductInput.ProductID,
      },
      QueueJobs.PRODUCTS,
    );
    return await this.ProductModel.findOneAndUpdate(
      { ProductID: updateProductInput.ProductID, UserID: req.sub.UserID },
      { ...updateProductInput, ProductVideo: process.env.TEST_VIDEO },
      { new: true },
    ).exec();
  }

  remove(ProductID: string, req: express.Request) {
    return this.ProductModel.findOneAndDelete(
      { ProductID, UserID: req.sub.UserID },
      { rawResult: true },
    ).exec();
  }
}
