import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { Role } from '../common/interface';
import { UpdateItemInput } from '../services/orders/dto/create-order.input';
import { ItemResponse } from '../services/orders/entities/order.entity';
import { Item } from '../services/orders/models/orders.schema';
import { GraphRequest, Roles } from '../user.decorator';
import {
  CreateProductInput,
  FindProductInput,
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './models/products.schema';
import { FetchArgs } from '../common/address.input';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.DESIGNER)
  @Mutation(() => Product, { name: 'CreateProduct' })
  createProduct(
    @Args('createProductInput', { type: () => CreateProductInput })
    createProductInput: CreateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.create(createProductInput, req);
  }

  @Roles(Role.PUBLIC)
  @Query(() => [Product], { name: 'GetProducts' })
  findAll(@Args() fetchArgs: FetchArgs) {
    return this.productsService.findAll(fetchArgs);
  }

  @Roles(Role.VENDOR)
  @Query(() => [Product], { name: 'GetVendorProducts' })
  find(@GraphRequest() req: express.Request) {
    return this.productsService.find(req);
  }

  @Roles(Role.VENDOR)
  @Mutation(() => ItemResponse, { name: 'UpdateItemStatus' })
  updateItemStatus(
    @Args('updateItemStatus', { type: () => UpdateItemInput })
    updateItemStatus: UpdateItemInput,
  ) {
    return this.productsService.updateItemStatus(updateItemStatus);
  }

  @Roles(Role.VENDOR)
  @Query(() => [Item], { name: 'ProductLists' })
  ProcessProducts(@GraphRequest() req: express.Request) {
    return this.productsService.Items(req);
  }

  @Roles(Role.VENDOR)
  @Query(() => Product, { name: 'GetProduct' })
  findOne(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.findOne(findProductInput.ProductID, req);
  }

  @Roles(Role.VENDOR)
  @Mutation(() => Product, { name: 'UpdateProduct' })
  updateProduct(
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.update(updateProductInput, req);
  }

  @Roles(Role.VENDOR)
  @Mutation(() => Product, { name: 'DeleteProduct' })
  removeProduct(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.remove(findProductInput.ProductID, req);
  }
}
