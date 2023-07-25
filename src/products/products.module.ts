import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../services/auth/auth.module';
import { OrdersModule } from '../services/orders/orders.module';
import { QueueModule } from '../services/queue/queue.module';
import { Product, ProductSchema } from './models/products.schema';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => OrdersModule),
    AuthModule,
    UsersModule,
    QueueModule,
  ],
  providers: [ProductsResolver, ProductsService, PrismaService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
