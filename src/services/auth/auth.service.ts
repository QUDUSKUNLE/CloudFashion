import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '../../users/models/user.schema';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async validateUser(
    Email: string,
    Password: string,
  ): Promise<{ AccessToken: string }> {
    const user = await this.prismaService.users.findUnique({
      where: { Email },
    });
    if (user && (await bcryptjs.compare(Password, user.Password))) {
      return this.signToken(user);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  logOutUser(): { Message: string } {
    return { Message: 'User`s logout successfully.' };
  }

  async validateToken(
    token: string,
  ): Promise<{ isValid: boolean; user?: User }> {
    try {
      const { sub } = this.jwtService.verify(token);
      const getUser = await this.redisCacheService.get(sub);
      let user = getUser ? JSON.parse(getUser) : undefined;
      if (!user) {
        user = await this.prismaService.users.findUnique({
          where: { UserID: sub },
        });
        await this.redisCacheService.set(user.UserID, user);
        return { user, isValid: true };
      }
      return { user, isValid: true };
    } catch (e) {
      if (e.message?.includes('null')) {
        throw new UnauthorizedException('Unauthorizied user.');
      }
      throw new UnauthorizedException(e.message);
    }
  }

  async signToken(user: unknown) {
    return {
      AccessToken: this.jwtService.sign({
        payload: (user as User).FirstName,
        sub: (user as User).UserID,
      }),
    };
  }
}
