import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UpdateTrainerDto } from '../dto/update-trainer.dto';
import { TrainerDocument } from '../interfaces/trainer.interface';
import { TrainerRepository } from './trainer.repository';

const mockTrainerModel = {
  new: jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(dto),
  })),
  constructor: jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(dto),
  })),
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('TrainerRepository', () => {
  let repository: TrainerRepository;
  let model: Model<TrainerDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainerRepository,
        {
          provide: getModelToken('PokedexTrainers'),
          useValue: mockTrainerModel,
        },
      ],
    }).compile();

    repository = module.get<TrainerRepository>(TrainerRepository);
    model = module.get<Model<TrainerDocument>>(
      getModelToken('PokedexTrainers'),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of Trainers', async () => {
      const mockTrainers = [{ id: 1, name: 'Vitoria' }];
      (model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTrainers),
      });

      const result = await repository.getAll();
      expect(result).toEqual(mockTrainers);
      expect(model.find).toHaveBeenCalled();
    });

    it('should throw an error if there is an issue fetching Trainers', async () => {
      (model.find as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error fetching all Trainers')),
      });

      await expect(repository.getAll()).rejects.toThrow(
        'Error fetching all Trainers',
      );
    });
  });

  describe('get', () => {
    it('should return a Trainer by ID', async () => {
      const mockTrainer = { id: 1, name: 'Vitoria' };
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTrainer),
      });

      const result = await repository.get(1);
      expect(result).toEqual(mockTrainer);
      expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if Trainer is not found', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await repository.get(1);
      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update and return a Trainer', async () => {
      const updateTrainerDto: UpdateTrainerDto = {
        name: 'Vitoria',
        pokemons: [3, 4, 5],
        imageUrl:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
      };

      const mockTrainer = { id: 1, name: 'Vitoria' };
      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockTrainer),
      });

      const result = await repository.update(1, updateTrainerDto);
      expect(result).toEqual(mockTrainer);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        1,
        updateTrainerDto,
        { new: true },
      );
    });

    it('should throw an error if there is an issue updating Trainer', async () => {
      const updateTrainerDto: UpdateTrainerDto = {
        name: 'Vitoria',
        pokemons: [3, 4, 5],
        imageUrl:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
      };

      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error updating Trainer')),
      });

      await expect(repository.update(1, updateTrainerDto)).rejects.toThrow(
        'Error updating Trainer',
      );
    });
  });

  describe('delete', () => {
    it('should delete a Trainer', async () => {
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({}),
      });

      await repository.delete(1);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if there is an issue deleting Trainer', async () => {
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error deleting Trainer')),
      });

      mockTrainerModel.constructor = jest.fn().mockImplementation(() => {
        throw new Error('Error creating new Trainer');
      });

      await expect(repository.delete(1)).rejects.toThrow(
        'Error deleting Trainer',
      );
    });
  });
});
