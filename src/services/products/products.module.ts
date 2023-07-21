import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { QueueModule } from '../queue/queue.module';
import { Product, ProductSchema } from './models/products.schema';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => OrdersModule),
    AuthModule,
    UsersModule,
    QueueModule,
  ],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
