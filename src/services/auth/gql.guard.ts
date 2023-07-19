import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as express from 'express';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  getRequest(context: ExecutionContext): express.Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const { authorization } = req.headers;

    if (!authorization) {
      throw new BadRequestException('Authorization header not found.');
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      throw new BadRequestException(
        `Authentication type \'Bearer\' required. Found \'${type}\'`,
      );
    }
    const { isValid, user } = await this.authService.validateToken(token);

    if (isValid && user) {
      req.sub = user;
      return true;
    }
    throw new UnauthorizedException('Token not valid.');
  }
}
