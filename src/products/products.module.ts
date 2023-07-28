import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '../common';
import { AuthModule } from '../services/auth/auth.module';
import { OrdersModule } from '../services/orders/orders.module';
import { QueueModule } from '../services/queue/queue.module';
import { UsersModule } from '../users/users.module';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

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
