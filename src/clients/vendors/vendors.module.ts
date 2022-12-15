import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from 'src/clients/users/users.module';
import { AuthModule } from 'src/services/auth/auth.module';
import { RedisCacheModule } from '../../services/redis-cache/redis-cache.module';
import { ShipmentsModule } from 'src/services/shipments/shipments.module';
import { Vendor, VendorSchema } from './models/vendor.schema';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
    AuthModule,
    UsersModule,
    ShipmentsModule,
    RedisCacheModule,
  ],
  providers: [VendorsResolver, VendorsService],
  exports: [VendorsService, MongooseModule],
})
export class VendorsModule {}
