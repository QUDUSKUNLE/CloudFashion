import { Test, TestingModule } from '@nestjs/testing';
import { DesignersResolver } from './designers.resolver';
import { DesignersService } from './designers.service';
import { createRequest } from 'node-mocks-http';
import { MockData, MODULE } from '../mock/mock.data';
import { Role } from '../common';

describe('DesignersResolver', () => {
  let resolver: DesignersResolver;
  let spyDesignerService: DesignersService;

  const req = createRequest({
    method: 'POST',
    url: '/',
  });
  req.sub = MockData.SERVICES[MODULE.USER].USER;

  beforeAll(async () => {
    const ServiceProvider = {
      provide: DesignersService,
      useFactory: () => ({
        Create: jest.fn(() => []),
        FindAll: jest.fn(() => []),
        FindOne: jest.fn(() => []),
        Update: jest.fn(() => []),
        Remove: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignersResolver, DesignersService, ServiceProvider],
    }).compile();

    resolver = module.get<DesignersResolver>(DesignersResolver);
    spyDesignerService = module.get<DesignersService>(DesignersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('CreateDesigner method', () => {
    it('should be able to create anew designer', async () => {
      spyDesignerService.Create = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
        UserID: req.sub.UserID,
      });
      req.sub.Roles.splice(req.sub.Roles.indexOf(Role.DESIGNER), 1);
      const result = await resolver.CreateDesigner(
        {
          ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
        },
        req,
      );
      expect(result.UserID).toEqual(req.sub.UserID);
      expect(spyDesignerService.Create).toHaveBeenCalled();
    });
    it('should throw an error when Role is not Designer', async () => {
      return await resolver
        .CreateDesigner(
          {
            ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
            Role: Role.USER,
          },
          req,
        )
        .catch((e) => expect(e?.message).toEqual(`Invalid Role: ${Role.USER}`));
    });
    it('should throw a designer role is already created', async () => {
      return await resolver
        .CreateDesigner(
          {
            ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
          },
          req,
        )
        .catch((e) => expect(e?.message).toEqual('User`s already a designer.'));
    });
    it('should throw a designer role is already created', async () => {
      spyDesignerService.Create = jest.fn().mockRejectedValue({
        code: 'P2002',
        message: 'User`s already a designer.',
      });
      req.sub.Roles.splice(req.sub.Roles.indexOf(Role.DESIGNER));
      return await resolver
        .CreateDesigner(
          {
            ...MockData.SERVICES[MODULE.DESIGNER].CREATE_DESIGNER,
          },
          req,
        )
        .catch((e) => expect(e?.message).toEqual('User`s already a designer.'));
    });
  });
  describe('FindAll method', () => {
    it('should be able to find array of Designers', async () => {
      spyDesignerService.FindAll = jest.fn().mockReturnValue([]);
      const result = await resolver.FindAll(MockData.SERVICES.ARGS);
      expect(spyDesignerService.FindAll).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
  describe('FindOne method', () => {
    it('should be able to find a designer of given DesignerID', async () => {
      spyDesignerService.FindOne = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
        DesignerID: '1',
      });
      const result = await resolver.FindOne({ DesignerID: '1' }, req);
      expect(result).toBeDefined();
      expect(spyDesignerService.FindOne).toHaveBeenCalled();
    });
  });
  describe('Update method', () => {
    it('should be able to find update a designer', async () => {
      spyDesignerService.Update = jest.fn().mockReturnValue({
        ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE,
        DesignerID: '1',
      });
      const result = await resolver.UpdateDesigner(
        { ...MockData.SERVICES[MODULE.DESIGNER].FIND_ONE, DesignerID: '1' },
        req,
      );
      expect(result).toBeDefined();
      expect(spyDesignerService.Update).toHaveBeenCalled();
    });
  });
  describe('Delete method', () => {
    it('should be able to delete designer', async () => {
      spyDesignerService.Remove = jest
        .fn()
        .mockReturnValue(MockData.SERVICES[MODULE.DESIGNER].REMOVE_MESSAGE);
      const result = await resolver.RemoveDesigner({ DesignerID: '1' }, req);
      expect(result).toEqual(MockData.SERVICES[MODULE.DESIGNER].REMOVE_MESSAGE);
      expect(spyDesignerService.Remove).toHaveBeenCalled();
    });
  });
});
