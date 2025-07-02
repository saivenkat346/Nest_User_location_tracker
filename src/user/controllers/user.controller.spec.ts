import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserService: Partial<Record<keyof UserService, jest.Mock>> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService) as jest.Mocked<UserService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call userService.create with correct data', async () => {
      const dto: CreateUserDto = { userName: 'test_user', isActive: false };
      const result: User = { id: 1, userName: 'test_user', isActive: false, locations: [] };

      userService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(userService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        { id: 1, userName: 'john', isActive: false, locations: [] },
      ];
      userService.findAll.mockResolvedValue(users);

      expect(await controller.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user: User = { id: 1, userName: 'john', isActive: false, locations: [] };
      userService.findOne.mockResolvedValue(user);

      expect(await controller.findOne('1')).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call update with correct ID and data', async () => {
      const dto: UpdateUserDto = { userName: 'updated' };
      const updated: User = { id: 1, userName: 'updated', isActive: false, locations: [] };

      userService.update.mockResolvedValue(updated);

      expect(await controller.update('1', dto)).toEqual(updated);
      expect(userService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call remove and return result', async () => {
      const response = { message: 'User with ID 1 has been deleted' };
      userService.remove.mockResolvedValue(response);

      expect(await controller.remove('1')).toEqual(response);
      expect(userService.remove).toHaveBeenCalledWith(1);
    });
  });
});
