import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from '../helpers/index';
import { Item, ItemSchema, Order, OrderSchema } from './models/orders.schema';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

import { ProductsModule } from '../../products/products.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentsModule } from '../payments/payments.module';
import { QueueModule } from '../queue/queue.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { StacksModule } from '../stack/stack.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    AuthModule,
    QueueModule,
    forwardRef(() => ProductsModule),
    RedisCacheModule,
    PaymentsModule,
    StacksModule,
    forwardRef(() => ShipmentsModule),
  ],
  providers: [OrdersResolver, OrdersService, HelperService],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
