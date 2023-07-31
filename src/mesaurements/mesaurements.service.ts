import { Injectable } from '@nestjs/common';
import { IMeasurement } from './interface/measurement.interface';
import { CreateMesaurementInput } from './dto/create-mesaurement.input';
import { UpdateMesaurementInput } from './dto/update-mesaurement.input';

@Injectable()
export class MesaurementsService implements IMeasurement<string> {
  CreateMeasurement(data: unknown): Promise<string> {
    throw new Error('Method not implemented.');
  }
  GetMeasurement(MeasurementID: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  GetMeasruements(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  UpdateMeasurement(MeasurementID: string, data: unknown): Promise<string> {
    throw new Error('Method not implemented.');
  }
  DeleteMeasurement(MeasurementID: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  create(createMesaurementInput: CreateMesaurementInput) {
    return 'This action adds a new mesaurement';
  }

  findAll() {
    return `This action returns all mesaurements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mesaurement`;
  }

  update(id: number, updateMesaurementInput: UpdateMesaurementInput) {
    return `This action updates a #${id} mesaurement`;
  }

  remove(id: number) {
    return `This action removes a #${id} mesaurement`;
  }
}
