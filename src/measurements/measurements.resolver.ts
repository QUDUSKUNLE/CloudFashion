import * as express from 'express';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMeasurementInput } from './dto/create-measurement.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';
import { Measurement } from './entities/measurement.entity';
import { MeasurementsService } from './measurements.service';
import { GraphRequest, Role, Roles } from '../common';

@Resolver(() => Measurement)
export class MeasurementsResolver {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Roles(Role.DESIGNER)
  @Mutation(() => Measurement)
  async CreateMesaurement(
    @Args('createMeasurementInput')
    createMeasurementInput: CreateMeasurementInput,
    @GraphRequest() req: express.Request,
  ) {
    try {
      return await this.measurementsService.CreateMeasurement(
        createMeasurementInput,
        req,
      );
    } catch (e) {
      throw e;
    }
  }

  @Query(() => [Measurement], { name: 'mesaurements' })
  findAll() {
    return this.measurementsService.findAll();
  }

  @Query(() => Measurement, { name: 'mesaurement' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.measurementsService.findOne(id);
  }

  @Mutation(() => Measurement)
  updateMesaurement(
    @Args('updateMesaurementInput')
    updateMesaurementInput: UpdateMeasurementInput,
  ) {
    return this.measurementsService.update(
      +updateMesaurementInput.MeasurementID,
      updateMesaurementInput,
    );
  }

  @Mutation(() => Measurement)
  removeMesaurement(@Args('id', { type: () => Int }) id: number) {
    return this.measurementsService.remove(id);
  }
}
