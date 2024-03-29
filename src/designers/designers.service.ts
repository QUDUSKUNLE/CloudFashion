import { Injectable, NotFoundException } from '@nestjs/common';
import * as express from 'express';

import { FetchArguments, PrismaService, Role } from '../common';
import { CreateDesignerInput } from './dto/create-designer.input';
import { UpdateDesignerInput } from './dto/update-designer.input';

@Injectable()
export class DesignersService {
  constructor(private readonly prismaService: PrismaService) {}
  async Create(createDesignerInput: CreateDesignerInput, req: express.Request) {
    try {
      const result = await this.prismaService.designers.create({
        data: {
          User: {
            connect: {
              UserID: req.sub.UserID,
            },
          },
          DesignerName: createDesignerInput.DesignerName,
          DesignerPhoneNumbers: createDesignerInput.DesignerPhoneNumbers,
          DesignerAddress: {
            StreetNo: createDesignerInput.DesignerAddress.StreetNo,
            StreetName: createDesignerInput.DesignerAddress.StreetName,
            City: createDesignerInput.DesignerAddress.City,
            State: <string>(
              (createDesignerInput.DesignerAddress.State as unknown)
            ),
          },
        },
      });
      await this.prismaService.users.update({
        where: { UserID: req.sub.UserID },
        data: { Roles: req.sub.Roles as string[] },
      });
      return result;
    } catch (e) {
      throw e;
    }
  }

  async FindAll(fetchArgs: FetchArguments) {
    return await this.prismaService.designers.findMany({
      skip: fetchArgs.Skip,
      take: fetchArgs.Take,
    });
  }

  async FindOne(DesignerID: string, req: express.Request) {
    const designer = await this.prismaService.designers.findUnique({
      where: {
        DesignerID,
        UserID: req.sub.UserID,
      },
    });
    if (designer) return designer;
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }

  async Update(updateDesignerInput: UpdateDesignerInput, req: express.Request) {
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

  async Remove(DesignerID: string, req: express.Request) {
    const designer = await this.prismaService.designers.findUnique({
      where: { DesignerID, UserID: req.sub.UserID },
    });
    if (designer) {
      const index = req.sub.Roles.indexOf(Role.DESIGNER);
      req.sub.Roles.splice(index, 1);
      return 'Designer archived.';
    }
    throw new NotFoundException(`Designer ${DesignerID} not found.`);
  }
}
