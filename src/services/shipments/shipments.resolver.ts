import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as express from 'express';
import { UserRole } from '../../common/interface';
import { GraphRequest, Roles } from '../../user.decorator';
import {
  CreateShipmentInput,
  FindShipmentInput,
} from './dto/create-shipment.input';
import { UpdateShipmentInput } from './dto/update-shipment.input';
import { ShipmentsService } from './shipments.service';
import { Shipment } from './models/shipments.schema';

@Resolver(() => Shipment)
export class ShipmentsResolver {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Roles(UserRole.VENDOR)
  @Mutation(() => Shipment, { name: 'CreateShipment' })
  createShipment(
    @Args('createShipmentInput', { type: () => CreateShipmentInput })
    createShipmentInput: CreateShipmentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.shipmentsService.create(createShipmentInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Query(() => [Shipment], { name: 'GetShipments' })
  findAll(@GraphRequest() req: express.Request) {
    return this.shipmentsService.findAll(req);
  }

  @Roles(UserRole.VENDOR)
  @Query(() => Shipment, { name: 'GetShipment' })
  findOne(
    @Args('findShipmentInput', { type: () => FindShipmentInput })
    findShipmentInput: FindShipmentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.shipmentsService.findOne(findShipmentInput, req);
  }

  @Roles(UserRole.VENDOR)
  @Mutation(() => Shipment, { name: 'UpdateShipment' })
  updateShipment(
    @Args('updateShipmentInput', { type: () => UpdateShipmentInput })
    updateShipmentInput: UpdateShipmentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.shipmentsService.update(updateShipmentInput, req);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Shipment, { name: 'DeleteShipment' })
  removeShipment(
    @Args('findShipmentInput', { type: () => FindShipmentInput })
    findShipmentInput: FindShipmentInput,
    @GraphRequest() req: express.Request,
  ) {
    return this.shipmentsService.remove(findShipmentInput, req);
  }
}
