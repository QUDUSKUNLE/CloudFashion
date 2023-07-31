import { Injectable } from '@nestjs/common';
import { IMeasurement } from './interface/measurement.interface';
import { CreateMeasurementInput } from './dto/create-measurement.input';
import { FindMeasurementInput } from './dto/create-measurement.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';

@Injectable()
export class MeasurementsService implements IMeasurement<string> {
  GetMeasurement(findMeasurementInput: FindMeasurementInput): Promise<string> {
    throw new Error('Method not implemented.');
  }
  UpdateMeasurement(
    updateMeasurementInput: UpdateMeasurementInput,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  DeleteMeasurement(MeasurementID: FindMeasurementInput): Promise<void> {
    throw new Error('Method not implemented.');
  }
  CreateMeasurement(data: unknown): Promise<string> {
    throw new Error('Method not implemented.');
  }
  GetMeasruements(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  create(createMeasurementInput: CreateMeasurementInput) {
    return 'This action adds a new mesaurement';
  }

  findAll() {
    return `This action returns all mesaurements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mesaurement`;
  }

  update(id: number, updateMesaurementInput: UpdateMeasurementInput) {
    return `This action updates a #${id} mesaurement`;
  }

  remove(id: number) {
    return `This action removes a #${id} mesaurement`;
  }
}
