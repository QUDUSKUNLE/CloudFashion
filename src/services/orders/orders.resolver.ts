import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import { Model } from 'mongoose';
import { Role } from '../../common/interface';
import { Product, ProductDocument } from '../../products/models/products.schema';
import { GraphRequest, Roles } from '../../user.decorator';
import { HelperService } from '../helpers/index';
import { CreateOrderInput, FindOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrderResponse } from './entities/order.entity';
import { AOrder, Order } from './models/orders.schema';
import { OrdersService } from './orders.service';

@Resolver()
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly helperService: HelperService,
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  @Roles(Role.USER)
  @Mutation(() => OrderResponse, { name: 'CreateOrder' })
  async createOrder(
    @Args('createOrderInput', { type: () => CreateOrderInput })
    createOrderInput: CreateOrderInput,
    @GraphRequest() req: express.Request,
  ) {
    await this.helperService.orderValidations(
      createOrderInput,
      this.ProductModel,
    );
    return this.ordersService.create(createOrderInput, req);
  }

  @Roles(Role.USER)
  @Query(() => [AOrder], { name: 'GetOrders' })
  findAll(@GraphRequest() req: express.Request) {
    return this.ordersService.findAll(req);
  }

  @Roles(Role.USER)
  @Query(() => AOrder, { name: 'GetOrder' })
  findAOrder(
    @Args('findOrderInput', { type: () => FindOrderInput })
    findOrderInput: FindOrderInput,
    @GraphRequest() req: express.Request,
  ): Promise<AOrder> {
    return this.ordersService.findOrder(findOrderInput, req);
  }

  @Roles(Role.USER)
  @Mutation(() => Order, { name: 'UpdateOrder' })
  updateOrder(
    @Args('updateOrderInput', { type: () => UpdateOrderInput })
    updateOrderInput: UpdateOrderInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.ordersService.update(updateOrderInput, req);
  }

  @Roles(Role.ADMIN)
  @Mutation(() => Order, { name: 'DeleteOrder' })
  removeOrder(
    @Args('findOrderInput', { type: () => FindOrderInput })
    findOrderInput: FindOrderInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.ordersService.remove(findOrderInput, req);
  }
}
