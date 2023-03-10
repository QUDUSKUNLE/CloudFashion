import * as bcrypt from 'bcryptjs';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from 'src/services/auth/auth.module';
import { User, UserSchema } from './models/user.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async () => {
          UserSchema.pre('save', function (next) {
            bcrypt.hash(this.Password, 10, (error, hash) => {
              if (error) {
                return next(error);
              }
              this.Password = hash;
              next();
            });
          });
          return UserSchema;
        },
      },
    ]),
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
