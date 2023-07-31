import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMeasurementInput } from './dto/create-measurement.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';
import { Measurement } from './entities/measurement.entity';
import { MeasurementsService } from './measurements.service';

@Resolver(() => Measurement)
export class MeasurementsResolver {
  constructor(private readonly mesaurementsService: MeasurementsService) {}

  @Mutation(() => Measurement)
  createMesaurement(
    @Args('createMeasurementInput')
    createMeasurementInput: CreateMeasurementInput,
  ) {
    return this.mesaurementsService.create(createMeasurementInput);
  }

  @Query(() => [Measurement], { name: 'mesaurements' })
  findAll() {
    return this.mesaurementsService.findAll();
  }

  @Query(() => Measurement, { name: 'mesaurement' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.mesaurementsService.findOne(id);
  }

  @Mutation(() => Measurement)
  updateMesaurement(
    @Args('updateMesaurementInput')
    updateMesaurementInput: UpdateMeasurementInput,
  ) {
    return this.mesaurementsService.update(
      +updateMesaurementInput.MeasurementID,
      updateMesaurementInput,
    );
  }

  @Mutation(() => Measurement)
  removeMesaurement(@Args('id', { type: () => Int }) id: number) {
    return this.mesaurementsService.remove(id);
  }
}
