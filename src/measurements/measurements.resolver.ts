import * as express from 'express';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateMeasurementInput,
  FindMeasurementInput,
  GetCustomerMeasurementInput,
} from './dto/create-measurement.input';
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

  @Roles(Role.DESIGNER)
  @Query(() => [Measurement], { name: 'Measurements' })
  FindAll(@GraphRequest() req: express.Request) {
    return this.measurementsService.GetMeasurements(req);
  }

  @Roles(Role.DESIGNER)
  @Query(() => [Measurement], { name: 'GetCustomerMeasurements' })
  GetCustomerMesaurements(
    @Args('getCustomerMeasurementInput', {
      type: () => GetCustomerMeasurementInput,
    })
    getCustomerMeasurementInput: GetCustomerMeasurementInput,
  ) {
    return this.measurementsService.GetCustomerMeasurement(
      getCustomerMeasurementInput,
    );
  }

  @Roles(Role.DESIGNER)
  @Query(() => Measurement, { name: 'Measurement' })
  FindMeasurement(
    @Args('findMeasurementInput', { type: () => FindMeasurementInput })
    findMeasurementInput: FindMeasurementInput,
  ) {
    return this.measurementsService.findOne(findMeasurementInput);
  }

  @Roles(Role.DESIGNER)
  @Mutation(() => Measurement)
  UpdateMeasurement(
    @Args('updateMeasurementInput')
    updateMesaurementInput: UpdateMeasurementInput,
  ) {
    return this.measurementsService.update(
      +updateMesaurementInput.MeasurementID,
      updateMesaurementInput,
    );
  }
}
