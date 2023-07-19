import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import * as express from 'express';
import { Model } from 'mongoose';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
import { HelperService } from '../helpers/index';
import { Product, ProductDocument } from '../products/models/products.schema';
import { CreateOrderInput, FindOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { OrderResponse } from './entities/order.entity';
import { Order, AOrder } from './models/orders.schema';
import { OrdersService } from './orders.service';

@Resolver()
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly helperService: HelperService,
    @InjectModel(Product.name) private ProductModel: Model<ProductDocument>,
  ) {}

  @Roles(UserRole.USER)
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

  @Roles(UserRole.USER)
  @Query(() => [AOrder], { name: 'GetOrders' })
  findAll(@GraphRequest() req: express.Request) {
    return this.ordersService.findAll(req);
  }

  @Roles(UserRole.USER)
  @Query(() => AOrder, { name: 'GetOrder' })
  findAOrder(
    @Args('findOrderInput', { type: () => FindOrderInput })
    findOrderInput: FindOrderInput,
    @GraphRequest() req: express.Request,
  ): Promise<AOrder> {
    return this.ordersService.findOrder(findOrderInput, req);
  }

  @Roles(UserRole.USER)
  @Mutation(() => Order, { name: 'UpdateOrder' })
  updateOrder(
    @Args('updateOrderInput', { type: () => UpdateOrderInput })
    updateOrderInput: UpdateOrderInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.ordersService.update(updateOrderInput, req);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Order, { name: 'DeleteOrder' })
  removeOrder(
    @Args('findOrderInput', { type: () => FindOrderInput })
    findOrderInput: FindOrderInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.ordersService.remove(findOrderInput, req);
  }
}
