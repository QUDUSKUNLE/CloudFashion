import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../../clients/users/users.module';
import { VendorsModule } from '../../clients/vendors/vendors.module';
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
    forwardRef(() => VendorsModule),
    QueueModule,
  ],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
