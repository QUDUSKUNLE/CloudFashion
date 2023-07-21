import { Injectable, NotFoundException } from '@nestjs/common';
import * as express from 'express';

import { Role } from '../common/interface';
import { CreateDesignerInput } from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DesignersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createDesignerInput: CreateDesignerInput, req: express.Request) {
    return await this.prismaService.designers.create({
      data: {
        UserID: req.sub.UserID,
        DesignerName: createDesignerInput.DesignerName,
        DesignerPhoneNumbers: createDesignerInput.DesignerPhoneNumbers,
        DesignerAddress: {
          StreetNo: createDesignerInput.DesignerAddress.StreetNo,
          StreetName: createDesignerInput.DesignerAddress.StreetName,
          City: createDesignerInput.DesignerAddress.City,
          State: <string>(createDesignerInput.DesignerAddress.State as unknown),
        },
      },
    });
  }

  async findAll() {
    return await this.prismaService.designers.findMany();
  }

  async findOne(DesignerID: string, req: express.Request) {
    const designer = await this.prismaService.designers.findUnique({
      where: {
        DesignerID,
        UserID: req.sub.UserID,
      },
    });
    if (designer) return designer;
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }

  async update(updateDesignerInput: UpdateDesignerInput, req: express.Request) {
    return await this.prismaService.designers.update({
      where: {
        DesignerID: updateDesignerInput.DesignerID,
        UserID: req.sub.UserID,
      },
      data: {
        DesignerName: updateDesignerInput.DesignerName,
      },
    });
  }

  async remove(DesignerID: string, req: express.Request) {
    const designer = await this.prismaService.designers.findUnique({
      where: { DesignerID, UserID: req.sub.UserID },
    });
    if (designer) {
      const index = req.sub.Roles.indexOf(Role.DESIGNER);
      req.sub.Roles.splice(index);
      return 'Done';
    }
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }
}
