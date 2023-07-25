import { forwardRef, Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../services/auth/auth.module';
import { OrdersModule } from '../services/orders/orders.module';
import { QueueModule } from '../services/queue/queue.module';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    AuthModule,
    UsersModule,
    QueueModule,
  ],
  providers: [ProductsResolver, ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
