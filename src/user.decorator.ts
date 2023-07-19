import * as express from 'express';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserRole } from './common/interface';

export const GraphRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): express.Request => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  },
);

export const Roles = (...roles: UserRole[]) => SetMetadata('Roles', roles);
