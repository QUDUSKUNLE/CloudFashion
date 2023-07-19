import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
import { UpdateItemInput } from '../orders/dto/create-order.input';
import { ItemResponse } from '../orders/entities/order.entity';
import { Item } from '../orders/models/orders.schema';
import {
  CreateProductInput,
  FindProductInput,
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './models/products.schema';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'CreateProduct' })
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
  @Query(() => [Product], { name: 'GetVendorProducts' })
  find(@GraphRequest() req: express.Request) {
    return this.productsService.find(req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => ItemResponse, { name: 'UpdateItemStatus' })
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
  @Query(() => Product, { name: 'GetProduct' })
  findOne(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.findOne(findProductInput.ProductID, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'UpdateProduct' })
  updateProduct(
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.update(updateProductInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Product, { name: 'DeleteProduct' })
  removeProduct(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.remove(findProductInput.ProductID, req);
  }
}
