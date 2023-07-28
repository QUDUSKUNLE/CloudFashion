import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as express from 'express';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../users/models/user.schema';
import { Role } from './interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  getRequest(context: ExecutionContext): express.Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('Roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = this.getRequest(context);
    // This check for public routes
    if (requiredRoles[0] === Role.PUBLIC) return true;
    const { authorization } = req.headers;
    if (!authorization) {
      throw new BadRequestException(`Authorization \'header\' not found.`);
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      throw new BadRequestException(`Authentication type \'Bearer\' required.`);
    }
    const { isValid, ...user } = await this.authService.validateToken(token);
    if (isValid && user) {
      req.sub = <User>user;
      return requiredRoles.some((role) => req.sub.Roles?.includes(role));
    }
    throw new UnauthorizedException('Token not valid.');
  }
}
