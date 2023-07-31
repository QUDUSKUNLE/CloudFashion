import { Module } from '@nestjs/common';
import { MeasurementsResolver } from './measurements.resolver';
import { MeasurementsService } from './measurements.service';

@Module({
  providers: [MeasurementsResolver, MeasurementsService],
})
export class MeasurementsModule {}
