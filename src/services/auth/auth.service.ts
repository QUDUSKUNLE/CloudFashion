import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import * as mongoose from 'mongoose';
import { PrismaService } from '../../common';
import { User } from '../../users/models/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
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
      if (mongoose.Types.ObjectId.isValid(sub)) {
        const user = await this.prismaService.users.findUnique({
          where: { UserID: sub },
          include: {
            Designer: true,
          },
        });
        if (user) return { ...user, isValid: true };
        throw new UnauthorizedException('User`s not found.');
      }
      throw new UnauthorizedException('Unauthorized user.');
    } catch (e) {
      if (e.message?.includes('null')) {
        throw new UnauthorizedException('Unauthorizied user.');
      }
      throw e;
    }
  }

  async signToken(user: Record<string, unknown>) {
    return {
      AccessToken: this.jwtService.sign({
        payload: user['FirstName'],
        sub: user['UserID'],
      }),
    };
  }
}
