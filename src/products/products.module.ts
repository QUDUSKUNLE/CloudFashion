import { Module } from '@nestjs/common';

import { PrismaService } from '../common';
import { AuthModule } from '../services/auth/auth.module';
import { QueueModule } from '../services/queue/queue.module';
import { UsersModule } from '../users/users.module';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, UsersModule, QueueModule],
  providers: [ProductsResolver, ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
