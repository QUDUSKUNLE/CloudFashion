import { Test, TestingModule } from '@nestjs/testing';
import { DesignersService } from './designers.service';
import { createRequest } from 'node-mocks-http';
import { PrismaService } from '../prisma/prisma.service';
import { MockData, MODULE } from '../mock/mock.data';

describe('DesignersService', () => {
  let service: DesignersService;
  let prisma: PrismaService;

  const req = createRequest({
    method: 'POST',
    url: '/',
  });
  req.sub = MockData.SERVICES[MODULE.USER].USER;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignersService, PrismaService],
    }).compile();

    service = module.get<DesignersService>(DesignersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create method', () => {
    it('should be able to create a new designer', async () => {
      prisma.designers.create = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
        UserID: req.sub.UserID,
      });
      prisma.users.update = jest.fn().mockReturnValue({});
      const result = await service.Create(
        MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
        req,
      );
      expect(prisma.designers.create).toHaveBeenCalled();
      expect(result.UserID).toEqual(req.sub.UserID);
    });
    it('should throw error when a designer already registered', () => {
      prisma.designers.create = jest.fn().mockRejectedValue({
        code: 'P2002',
        message: MockData.SERVICES[MODULE.DESIGNER].ERROR_MESSAGE,
      });
      return service
        .Create(MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER, req)
        .catch((e) =>
          expect(e?.message).toEqual(
            MockData.SERVICES[MODULE.DESIGNER].ERROR_MESSAGE,
          ),
        );
    });
  });
  describe('FindAll method', () => {
    it('should return array of designers', async () => {
      prisma.designers.findMany = jest.fn().mockReturnValue([]);
      await service.FindAll(MockData.SERVICES.ARGS);
      expect(prisma.designers.findMany).toHaveBeenCalled();
    });
  });
  describe('FindOne method', () => {
    it('should return a designer of a given ID', async () => {
      prisma.designers.findUnique = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
        DesignerID: '1',
      });
      await service.FindOne('1', req);
      expect(prisma.designers.findUnique).toHaveBeenCalled();
    });
    it('should throw error when a given designer ID is not found', async () => {
      prisma.designers.findUnique = jest.fn().mockReturnValue(null);
      return await service
        .FindOne('1', req)
        .catch((e) => expect(e?.message).toEqual('Designer 1 not found.'));
    });
  });
  describe('Update method', () => {
    it('should return an updated designer', async () => {
      prisma.designers.update = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
        DesignerID: '1',
      });
      await service.Update(
        {
          ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
          DesignerID: '1',
        },
        req,
      );
      expect(prisma.designers.update).toHaveBeenCalled();
    });
  });
  describe('Remove method', () => {
    it('should archive a designer', async () => {
      prisma.designers.findUnique = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
        DesignerID: '1',
      });
      const result = await service.Remove('1', req);
      expect(prisma.designers.findUnique).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(MockData.SERVICES[MODULE.DESIGNER].REMOVE_MESSAGE);
    });
    it('should throw error when a given designer ID is not found', async () => {
      prisma.designers.findUnique = jest.fn().mockReturnValue(null);
      return await service
        .Remove('1', req)
        .catch((e) => expect(e?.message).toEqual('Designer 1 not found.'));
    });
  });
});
