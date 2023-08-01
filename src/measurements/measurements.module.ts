import { Module } from '@nestjs/common';
import { MeasurementsResolver } from './measurements.resolver';
import { MeasurementsService } from './measurements.service';
import { PrismaService } from '../common';

@Module({
  providers: [MeasurementsResolver, MeasurementsService, PrismaService],
})
export class MeasurementsModule {}
