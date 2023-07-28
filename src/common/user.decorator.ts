import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as express from 'express';

import { Role } from './interface';

export const GraphRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): express.Request => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  },
);

export const Roles = (...roles: Role[]) => SetMetadata('Roles', roles);
