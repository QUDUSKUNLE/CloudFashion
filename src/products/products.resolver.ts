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
  CreateProduct(
    @Args('createProductInput', { type: () => CreateProductInput })
    createProductInput: CreateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.Create(createProductInput, req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Product], { name: 'GetProducts' })
  FindAll(@Args() fetchArgs: FetchArgs, @GraphRequest() req: express.Request) {
    return this.productsService.FindAll(fetchArgs, req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Product], { name: 'GetCustomerProducts' })
  Find(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
  ) {
    return this.productsService.Find(findProductInput);
  }

  @Roles(Role.DESIGNER)
  @Mutation(() => ItemResponse, { name: 'UpdateItemStatus' })
  UpdateItemStatus(
    @Args('updateItemStatus', { type: () => UpdateItemInput })
    updateItemStatus: UpdateItemInput,
  ) {
    return this.productsService.UpdateItemStatus(updateItemStatus);
  }

  @Roles(Role.ADMIN)
  @Query(() => [Item], { name: 'ProductLists' })
  ProcessProducts(@GraphRequest() req: express.Request) {
    return this.productsService.Items(req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => Product, { name: 'GetProduct' })
  FindOne(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.FindOne(findProductInput.ProductID, req);
  }

  @Roles(Role.VENDOR)
  @Mutation(() => Product, { name: 'UpdateProduct' })
  updateProduct(
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.Update(updateProductInput, req);
  }

  @Roles(Role.VENDOR)
  @Mutation(() => Product, { name: 'DeleteProduct' })
  removeProduct(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.Remove(findProductInput.ProductID, req);
  }
}
