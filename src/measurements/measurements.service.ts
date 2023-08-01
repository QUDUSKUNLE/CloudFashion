import * as express from 'express';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Measurement } from './entities/measurement.entity';
import { PrismaService, Parser } from '../common';
import { IMeasurement } from './interface/measurement.interface';
import { CreateMeasurementInput } from './dto/create-measurement.input';
import { FindMeasurementInput } from './dto/create-measurement.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';

@Injectable()
export class MeasurementsService implements IMeasurement<Measurement> {
  constructor(private readonly prisma: PrismaService) {}
  async CreateMeasurement(
    createMeasurementInput: CreateMeasurementInput,
    req: express.Request,
  ): Promise<Measurement> {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: {
          CustomerID: createMeasurementInput.CustomerID,
        },
        select: {
          CustomerID: true,
        },
      });
      if (!customer) throw new NotFoundException('Customer is not found');
      const result = await this.prisma.measurements.create({
        data: {
          MeasurementType: <string>createMeasurementInput.MeasurementType,
          Measurement: Parser(createMeasurementInput.Measurement),
          Customer: {
            connect: {
              CustomerID: createMeasurementInput.CustomerID,
            },
          },
        },
      });
      return {
        MeasurementID: result.MeasurementID,
        MeasurementType: result.MeasurementType,
        Measurement: Parser(result.Measurement),
        CreatedAt: result.CreatedAt,
        UpdatedAt: result.UpdatedAt,
      };
    } catch (e) {
      throw e;
    }
  }
  GetMeasurement(
    findMeasurementInput: FindMeasurementInput,
    req: express.Request,
  ): Promise<Measurement> {
    throw new UnprocessableEntityException('Method not implemented.');
  }
  UpdateMeasurement(
    updateMeasurementInput: UpdateMeasurementInput,
    req: express.Request,
  ): Promise<Measurement> {
    throw new UnprocessableEntityException('Method not implemented.');
  }
  DeleteMeasurement(
    MeasurementID: FindMeasurementInput,
    req: express.Request,
  ): Promise<void> {
    throw new UnprocessableEntityException('Method not implemented.');
  }
  GetMeasurements(req: express.Request): Promise<Measurement[]> {
    throw new UnprocessableEntityException('Method not implemented.');
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
