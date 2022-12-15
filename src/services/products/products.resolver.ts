import * as express from 'express';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'src/common/interface';
import { UpdateItemInput } from 'src/services/orders/dto/create-order.input';
import { ItemResponse } from 'src/services/orders/entities/order.entity';
import { GraphRequest, Roles } from 'src/user.decorator';
import {
  CreateProductInput,
  FindProductInput,
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductsService } from './products.service';
import { Product } from './models/products.schema';
import { Item } from '../orders/models/orders.schema';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'CreateAProduct' })
  createProduct(
    @Args('createProductInput', { type: () => CreateProductInput })
    createProductInput: CreateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.create(createProductInput, req);
  }

  @Roles(UserRole.PUBLIC)
  @Query(() => [Product], { name: 'GetProducts' })
  findAll() {
    return this.productsService.findAll();
  }

  @Roles(UserRole.VENDOR)
  @Query(() => [Product], { name: 'GetAVendorProducts' })
  find(@GraphRequest() req: express.Request) {
    return this.productsService.find(req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => ItemResponse, { name: 'UpdateAnItemStatus' })
  updateItemStatus(
    @Args('updateItemStatus', { type: () => UpdateItemInput })
    updateItemStatus: UpdateItemInput,
  ) {
    return this.productsService.updateItemStatus(updateItemStatus);
  }

  @Roles(UserRole.VENDOR)
  @Query(() => [Item], { name: 'ProductLists' })
  ProcessProducts(@GraphRequest() req: express.Request) {
    return this.productsService.Items(req);
  }

  @Roles(UserRole.VENDOR)
  @Query(() => Product, { name: 'GetAProduct' })
  findOne(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.findOne(findProductInput.ProductID, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'UpdateAProduct' })
  updateProduct(
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.update(updateProductInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'DeleteAProduct' })
  removeProduct(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.remove(findProductInput.ProductID, req);
  }
}
