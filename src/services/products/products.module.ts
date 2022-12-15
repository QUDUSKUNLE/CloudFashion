import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/clients/users/users.module';
import { OrdersModule } from '../orders/orders.module';
import { VendorsModule } from 'src/clients/vendors/vendors.module';
import { AuthModule } from 'src/services/auth/auth.module';
import { QueueModule } from 'src/services/queue/queue.module';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './models/products.schema';

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
