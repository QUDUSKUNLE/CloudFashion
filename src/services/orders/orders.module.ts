import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from '../helpers/index';
import { Item, ItemSchema, Order, OrderSchema } from './models/orders.schema';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

import { AuthModule } from 'src/services/auth/auth.module';
import { PaymentsModule } from 'src/services/payments/payments.module';
import { ProductsModule } from 'src/services/products/products.module';
import { QueueModule } from 'src/services/queue/queue.module';
import { RedisCacheModule } from 'src/services/redis-cache/redis-cache.module';
import { ShipmentsModule } from 'src/services/shipments/shipments.module';
import { StacksModule } from 'src/services/stack/stack.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    AuthModule,
    QueueModule,
    ProductsModule,
    RedisCacheModule,
    PaymentsModule,
    StacksModule,
    forwardRef(() => ShipmentsModule),
  ],
  providers: [OrdersResolver, OrdersService, HelperService],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
