import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { FetchArguments, GraphRequest, Role, Roles } from '../common';
import { UpdateItemInput } from '../services/orders/dto/create-order.input';
import { ItemResponse } from '../services/orders/entities/order.entity';
import { Item } from '../services/orders/models/orders.schema';
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
import { Product } from './models/products.schema';
import { ProductsService } from './products.service';

// Single Responsibility Principle related to Product
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.DESIGNER)
  @Mutation(() => Product, { name: 'CreateProduct' })
  async CreateProduct(
    @Args('createProductInput', { type: () => CreateProductInput })
    createProductInput: CreateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return await this.productsService.CreateProduct(createProductInput, req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Product], { name: 'DesignerGetCustomersProducts' })
  async DesignerFetchCustomersProducts(
    @Args() designerFetchCustomersProducts: DesignerFetchCustomersProducts,
    @GraphRequest() req: express.Request,
  ) {
    return await this.productsService.DesignerFetchCustomersProducts(
      designerFetchCustomersProducts,
      req,
    );
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Product], { name: 'DesignerGetCustomerProducts' })
  async DesignerFetchCustomerProducts(
    @Args() designerFetchCustomerProducts: DesignerFetchCustomerProducts,
    @GraphRequest() req: express.Request,
  ) {
    return await this.productsService.DesignerFetchCustomerProducts(
      designerFetchCustomerProducts,
      req,
    );
  }

  @Roles(Role.DESIGNER)
  @Query(() => Product, { name: 'DesignerGetCustomerProduct' })
  async DesignerFetchCustomerProduct(
    @Args() customerFetchProductsArguments: DesignerFetchCustomerProduct,
    @GraphRequest() req: express.Request,
  ) {
    return await this.productsService.DesignerFetchCustomerProduct(
      customerFetchProductsArguments,
      req,
    );
  }

  @Roles(Role.ADMIN)
  @Query(() => [Product], { name: 'GetProducts' })
  async FindAll(@Args() fetchArgs: FetchArguments) {
    return await this.productsService.FindAll(fetchArgs);
  }

  @Roles(Role.ADMIN)
  @Query(() => [Product], { name: 'GetCustomerProducts' })
  async FindOne(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
  ) {
    return await this.productsService.FindOne(findProductInput);
  }

  @Roles(Role.ADMIN)
  @Query(() => [Product], { name: 'CustomerFetchProducts' })
  async CustomerFetchProducts(
    @Args() customerFetchProducts: CustomerFetchProducts,
  ) {
    return await this.productsService.CustomerFetchProducts(
      customerFetchProducts,
    );
  }

  @Roles(Role.ADMIN)
  @Query(() => Product, { name: 'CustomerFetchProduct' })
  async CustomerFetchProduct(
    @Args() customerFetchProduct: CustomerFetchProduct,
  ) {
    return await this.productsService.CustomerFetchProduct(
      customerFetchProduct,
    );
  }

  @Roles(Role.ADMIN)
  @Mutation(() => ItemResponse, { name: 'UpdateItemStatus' })
  async UpdateItemStatus(
    @Args('updateItemStatus', { type: () => UpdateItemInput })
    updateItemStatus: UpdateItemInput,
  ) {
    return await this.productsService.UpdateItemStatus(updateItemStatus);
  }

  @Roles(Role.ADMIN)
  @Query(() => [Item], { name: 'ProductLists' })
  ProcessProducts(@GraphRequest() req: express.Request) {
    return this.productsService.Items(req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Product, { name: 'UpdateProduct' })
  UpdateProduct(
    @Args('updateProductInput', { type: () => UpdateProductInput })
    updateProductInput: UpdateProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.DesignerUpdateProduct(updateProductInput, req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Product, { name: 'DeleteProduct' })
  RemoveProduct(
    @Args('findProductInput', { type: () => FindProductInput })
    findProductInput: FindProductInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.productsService.Remove(findProductInput.ProductID, req);
  }
}
