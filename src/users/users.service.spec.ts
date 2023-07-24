import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../services/auth/auth.module';
import { MockData, MODULE } from '../mock/mock.data';

describe('UsersService', () => {
  let service: UsersService;
  // let prisma: PrismaService;

  beforeEach(async () => {
    jest.setTimeout(60000);
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [UsersService, PrismaService],
    }).compile();
    service = module.get<UsersService>(UsersService);
    // prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create method', () => {
    // it('should create a new user', async () => {
    //   prisma.users.create = jest.fn().mockReturnValue({
    //     ...MockData.SERVICES[MODULE.USER].CREATE_USER,
    //   });
    //   const { Email } = await service.create({
    //     ...MockData.SERVICES[MODULE.USER].CREATE_USER,
    //   });
    //   expect(Email).toBeDefined();
    // });
    it('should throw an error when password is less than 8 characters', async () => {
      return await service
        .create({
          ...MockData.SERVICES[MODULE.USER].CREATE_LESS_PASSWORD,
        })
        .catch((error) =>
          expect(error?.message).toEqual(
            MockData.SERVICES[MODULE.USER].CREATE_LESS_PASSWORD_ERROR,
          ),
        );
    });
  });
});
