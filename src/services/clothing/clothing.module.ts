import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { ClothingResolver } from './clothing.resolver';
import { ClothingService } from './clothing.service';
import {
  Clothing,
  ClothingSchema,
  MeasurementE,
  MeasurementSchema,
} from './models/clothing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clothing.name, schema: ClothingSchema },
      { name: MeasurementE.name, schema: MeasurementSchema },
    ]),
    AuthModule,
  ],
  providers: [ClothingResolver, ClothingService],
  exports: [ClothingService, MongooseModule],
})
export class ClothingModule {}
