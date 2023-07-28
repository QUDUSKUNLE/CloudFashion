import { Module } from '@nestjs/common';
import { CustomersResolver } from './customers.resolver';
import { CustomersService } from './customers.service';
import { PrismaService } from '../common';

@Module({
  providers: [CustomersResolver, CustomersService, PrismaService],
})
export class CustomersModule {}
