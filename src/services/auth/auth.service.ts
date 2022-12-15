import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../clients/users/models/user.schema';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async validateUser(
    Email: string,
    Password: string,
  ): Promise<{ AccessToken: string }> {
    const user = await this.UserModel.findOne({ Email }).exec();
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
  ): Promise<{ isValid: boolean; user?: UserDocument }> {
    try {
      const { sub } = this.jwtService.verify(token);
      const getUser = await this.redisCacheService.get(sub);
      let user: UserDocument = getUser ? JSON.parse(getUser) : undefined;
      if (!user) {
        user = await this.UserModel.findOne({ UserID: sub })
          .select({ Password: 0 })
          .exec();
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

  async signToken(user: UserDocument) {
    return {
      AccessToken: this.jwtService.sign({
        payload: user.FirstName,
        sub: user.UserID,
      }),
    };
  }
}
