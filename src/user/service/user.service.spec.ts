import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

type MockRepository<T extends object = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockUserRepository = (): MockRepository<User> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto = { userName: 'john_doe' };
      const created = { id: 1, ...dto };

      repository.create!.mockReturnValue(dto);
      repository.save!.mockResolvedValue(created);

      const result = await service.create(dto as any);
      expect(result).toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if username is missing', async () => {
      await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, userName: 'john' }];
      repository.find!.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, userName: 'john' };
      repository.findOne!.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if ID is not provided', async () => {
      await expect(service.findOne(undefined as any)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const existing = { id: 1, userName: 'old_name' };
      const updateDto = { userName: 'new_name' };
      const updated = { ...existing, ...updateDto };

      repository.findOne!.mockResolvedValue(existing);
      repository.save!.mockResolvedValue(updated);

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if user is not found', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.update(1, { userName: 'any' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const user = { id: 1, userName: 'john' };
      repository.findOne!.mockResolvedValue(user);
      repository.remove!.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual({ message: `User with ID 1 has been deleted` });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.remove(123)).rejects.toThrow(NotFoundException);
    });
  });
});
