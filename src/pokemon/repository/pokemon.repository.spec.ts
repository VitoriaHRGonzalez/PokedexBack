import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PokemonDocument } from '../interfaces/pokemon.interface';
import { PokemonRepository } from './pokemon.repository';

const mockPokemonModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('PokemonRepository', () => {
  let repository: PokemonRepository;
  let model: Model<PokemonDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonRepository,
        {
          provide: getModelToken('PokedexPokemons'),
          useValue: mockPokemonModel,
        },
      ],
    }).compile();

    repository = module.get<PokemonRepository>(PokemonRepository);
    model = module.get<Model<PokemonDocument>>(
      getModelToken('PokedexPokemons'),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of Pokémon', async () => {
      const mockPokemons = [{ id: 1, name: 'Bulbasaur' }];
      (model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPokemons),
      });

      const result = await repository.getAll();
      expect(result).toEqual(mockPokemons);
      expect(model.find).toHaveBeenCalled();
    });

    it('should throw an error if there is an issue fetching Pokémon', async () => {
      (model.find as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error fetching all Pokémon')),
      });

      await expect(repository.getAll()).rejects.toThrow(
        'Error fetching all Pokémon',
      );
    });
  });

  describe('get', () => {
    it('should return a Pokémon by ID', async () => {
      const mockPokemon = { id: 1, name: 'Bulbasaur' };
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await repository.get(1);
      expect(result).toEqual(mockPokemon);
      expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if Pokémon is not found', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await repository.get(1);
      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update and return a Pokémon', async () => {
      const updatePokemonDto: UpdatePokemonDto = {
        name: 'Ivysaur',
        stats: {
          hp: 60,
          attack: 62,
          defense: 63,
          speed: 60,
        },
      };

      const mockPokemon = { id: 1, name: 'Ivysaur' };
      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await repository.update('1', updatePokemonDto);
      expect(result).toEqual(mockPokemon);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updatePokemonDto,
        { new: true },
      );
    });

    it('should throw an error if there is an issue updating Pokémon', async () => {
      const updatePokemonDto: UpdatePokemonDto = {
        name: 'Ivysaur',
        stats: {
          hp: 60,
          attack: 62,
          defense: 63,
          speed: 60,
        },
      };

      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error updating Pokémon')),
      });

      await expect(repository.update('1', updatePokemonDto)).rejects.toThrow(
        'Error updating Pokémon',
      );
    });
  });

  describe('delete', () => {
    it('should delete a Pokémon', async () => {
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({}),
      });

      await repository.delete('1');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if there is an issue deleting Pokémon', async () => {
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error deleting Pokémon')),
      });

      await expect(repository.delete('1')).rejects.toThrow(
        'Error deleting Pokémon',
      );
    });
  });
});
