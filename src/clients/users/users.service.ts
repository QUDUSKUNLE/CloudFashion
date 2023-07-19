import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserInput, FindUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserInput: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(createUserInput.Password, 10);
    return await this.prismaService.user.create({
      data: {
        Email: createUserInput.Email,
        Password: <string>hashedPassword,
        PhoneNumbers: createUserInput.PhoneNumbers,
        FirstName: createUserInput.FirstName,
        LastName: createUserInput.LastName,
      },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany();
  }

  async findOne(findUserInput: FindUserInput) {
    return await this.prismaService.user.findUnique({
      where: { UserID: findUserInput.UserID },
    });
  }

  async updateOne(updateUserInput: UpdateUserInput) {
    return await this.prismaService.user.upsert({
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
    return await this.prismaService.user.deleteMany({
      where: {
        UserID: findUserInput.UserID,
      },
    });
  }
}
