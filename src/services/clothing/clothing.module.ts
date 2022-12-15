import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/services/auth/auth.module';
import { ClothingResolver } from './clothing.resolver';
import { ClothingService } from './clothing.service';
import {
  Clothing,
  ClothingSchema,
  Measurement,
  MeasurementSchema,
} from './models/clothing.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Clothing.name, schema: ClothingSchema },
      { name: Measurement.name, schema: MeasurementSchema },
    ]),
    AuthModule,
  ],
  providers: [ClothingResolver, ClothingService],
  exports: [ClothingService, MongooseModule],
})
export class ClothingModule {}
