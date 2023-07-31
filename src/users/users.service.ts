import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { FetchArguments } from '../common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserInput, FindUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserInput: CreateUserInput) {
    if (createUserInput.Password.length < 8) {
      throw new BadRequestException(
        'Password length should be at least 8 characters.',
      );
    }
    const hashedPassword = await bcrypt.hash(createUserInput.Password, 10);
    const result = await this.prismaService.users.create({
      data: {
        Email: createUserInput.Email,
        Password: <string>hashedPassword,
        PhoneNumbers: createUserInput.PhoneNumbers,
        FirstName: createUserInput.FirstName,
        LastName: createUserInput.LastName,
        Address: createUserInput.Address,
      },
    });
    return result;
  }

  async findAll(fetch: FetchArguments) {
    return await this.prismaService.users.findMany({
      skip: fetch.Skip,
      take: fetch.Take,
    });
  }

  async findOne(findUserInput: FindUserInput) {
    return await this.prismaService.users.findUnique({
      where: { UserID: findUserInput.UserID },
    });
  }

  async updateOne(updateUserInput: UpdateUserInput) {
    return await this.prismaService.users.upsert({
      where: {
        UserID: updateUserInput.UserID,
      },
      update: {
        Email: updateUserInput.Email,
      },
      create: undefined,
    });
  }

  async deleteOne(findUserInput: FindUserInput) {
    return await this.prismaService.users.deleteMany({
      where: {
        UserID: findUserInput.UserID,
      },
    });
  }
}
