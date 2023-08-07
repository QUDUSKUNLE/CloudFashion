import * as express from 'express';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Measurement } from './entities/measurement.entity';
import { PrismaService, Parser } from '../common';
import {
  CreateMeasurementInput,
  GetCustomerMeasurementInput,
  FindMeasurementInput,
} from './dto/create-measurement.input';
import { UpdateMeasurementInput } from './dto/update-measurement.input';

@Injectable()
export class MeasurementsService {
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
  async GetMeasurements(req: express.Request) {
    return await this.prisma.measurements.findMany();
  }
  create(createMeasurementInput: CreateMeasurementInput) {
    return 'This action adds a new mesaurement';
  }

  async GetCustomerMeasurement(
    getCustomerMeasurementInput: GetCustomerMeasurementInput,
  ) {
    return await this.prisma.measurements.findMany({
      where: {
        CustomerID: getCustomerMeasurementInput.CustomerID,
      },
    });
  }

  async findOne(findMeasurementInput: FindMeasurementInput) {
    return await this.prisma.measurements.findUnique({
      where: { MeasurementID: findMeasurementInput.MeasurementID },
    });
  }

  update(id: number, updateMesaurementInput: UpdateMeasurementInput) {
    return `This action updates a #${id} mesaurement`;
  }
}
