import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';
import { FetchArguments, PrismaService } from '../common';
import { UpdateItemInput } from '../services/orders/dto/create-order.input';
import { QueueJobs } from '../services/queue/queue.enums';
import { QueueService } from '../services/queue/queue.service';
import {
  CreateProductInput,
  FindProductInput,
  DesignerFetchCustomersProducts,
  DesignerFetchCustomerProducts,
  DesignerFetchCustomerProduct,
  CustomerFetchProducts,
  CustomerFetchProduct,
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  constructor(
    private readonly queueService: QueueService,
    private readonly prismaService: PrismaService,
  ) {}
  async CreateProduct(
    createProductInput: CreateProductInput,
    req: express.Request,
  ) {
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

  async FindAll(fetchArgs: FetchArguments) {
    return await this.prismaService.products.findMany({
      skip: fetchArgs.Skip,
      take: fetchArgs.Take,
    });
  }

  async DesignerFetchCustomersProducts(
    designerFetchCustomersProducts: DesignerFetchCustomersProducts,
    req: express.Request,
  ) {
    return await this.prismaService.products.findMany({
      skip: designerFetchCustomersProducts.Skip,
      take: designerFetchCustomersProducts.Take,
      where: {
        DesignerID: {
          hasSome: [req.sub.Designer?.DesignerID],
        },
      },
    });
  }

  async DesignerFetchCustomerProducts(
    designerFetchCustomerProducts: DesignerFetchCustomerProducts,
    req: express.Request,
  ) {
    return await this.prismaService.products.findMany({
      skip: designerFetchCustomerProducts.Skip,
      take: designerFetchCustomerProducts.Take,
      where: {
        DesignerID: {
          hasSome: [req.sub.Designer?.DesignerID],
        },
        CustomerID: designerFetchCustomerProducts.CustomerID,
      },
    });
  }

  async DesignerFetchCustomerProduct(
    designerFetchCustomerProduct: DesignerFetchCustomerProduct,
    req: express.Request,
  ) {
    return await this.prismaService.products.findUnique({
      where: {
        DesignerID: {
          hasSome: [req.sub.Designer?.DesignerID],
        },
        ProductID: designerFetchCustomerProduct.ProductID,
      },
    });
  }

  async CustomerFetchProducts(customerFetchProducts: CustomerFetchProducts) {
    return await this.prismaService.products.findMany({
      skip: customerFetchProducts.Skip,
      take: customerFetchProducts.Take,
      where: {
        CustomerID: customerFetchProducts.CustomerID,
      },
    });
  }

  async CustomerFetchProduct(customerFetchProduct: CustomerFetchProduct) {
    return await this.prismaService.products.findUnique({
      where: {
        CustomerID: customerFetchProduct.CustomerID,
        ProductID: customerFetchProduct.ProductID,
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
