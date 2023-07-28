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
import { FetchArgs, FetchCustomersArgument, PrismaService } from '../common';
import { Statuses } from '../products/entities/product.entity';
import { UpdateItemInput } from '../services/orders/dto/create-order.input';
import { Item, ItemDocument } from '../services/orders/models/orders.schema';
import { QueueJobs } from '../services/queue/queue.enums';
import { QueueService } from '../services/queue/queue.service';
import {
  CreateProductInput,
  FindProductInput,
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Item.name) private ItemModel: Model<ItemDocument>,
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}
  async Create(createProductInput: CreateProductInput, req: express.Request) {
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
          Customer: {
            connect: {
              CustomerID: createProductInput.CustomerID,
            },
          },
          Designers: {
            connect: {
              DesignerID: req.sub.Designer?.DesignerID,
            },
          },
        },
      });
      this.queueService.QueueJobs(
        {
          filePath,
          createProductInput,
          ProductID: createdProduct.ProductID,
        },
        QueueJobs.PRODUCTS,
      );
      return createdProduct;
    } catch (error) {
      throw error;
    }
  }

  async FindAll(fetchArgs: FetchArgs) {
    return await this.prismaService.products.findMany({
      skip: fetchArgs.Skip,
      take: fetchArgs.Take,
    });
  }

  async FindCustomerProducts(
    fetchCustomersArgument: FetchCustomersArgument,
    req: express.Request,
  ) {
    return await this.prismaService.products.findMany({
      skip: fetchCustomersArgument.Skip,
      take: fetchCustomersArgument.Take,
      where: {
        DesignerID: {
          hasSome: [req.sub.Designer?.DesignerID],
        },
        CustomerID: fetchCustomersArgument.CustomerID,
      },
    });
  }

  async Find(findProductInput: FindProductInput) {
    return await this.prismaService.products.findUnique({
      where: { ProductID: findProductInput.ProductID },
    });
  }

  async UpdateItemStatus(updateItemStatus: UpdateItemInput) {
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

  async FindOne(ProductID: string, req: express.Request) {
    return await this.prismaService.products.findUnique({
      where: { ProductID },
      // UserID: req.sub.UserID,
    });
  }

  async Update(updateProductInput: UpdateProductInput, req: express.Request) {
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
    this.queueService.QueueJobs(
      {
        filePath,
        updateProductInput,
        ProductID: updateProductInput.ProductID,
      },
      QueueJobs.PRODUCTS,
    );
    return await this.prismaService.products.update({
      where: {
        ProductID: updateProductInput.ProductID,
      },
      data: { ...updateProductInput, ProductVideo: process.env.TEST_VIDEO },
    });
  }

  Remove(ProductID: string, req: express.Request) {
    return this.prismaService.products.delete({
      where: { ProductID },
    });
  }
}
