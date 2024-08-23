import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { StatsDto } from './dto/stats.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonDocument } from './interfaces/pokemon.interface';
import { PokemonService } from './pokemon.service';

const mockPokemonModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('PokemonService', () => {
  let service: PokemonService;
  let model: Model<PokemonDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getModelToken('PokedexPokemons'),
          useValue: mockPokemonModel,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    model = module.get<Model<PokemonDocument>>(
      getModelToken('PokedexPokemons'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Pokémon', async () => {
      const mockPokemons = [{ id: '4', name: 'Charmander' }];
      (model.find as jest.Mock).mockImplementation(() => ({
        exec: jest.fn().mockResolvedValueOnce(mockPokemons),
      }));

      const result = await service.findAll();
      expect(result).toEqual(mockPokemons);
      expect(model.find).toHaveBeenCalled();
    });

    it('should throw an error if there is an issue fetching Pokémon', async () => {
      (model.find as jest.Mock).mockImplementation(() => ({
        exec: jest
          .fn()
          .mockRejectedValueOnce(new Error('Error fetching all Pokémon')),
      }));

      await expect(service.findAll()).rejects.toThrow(
        'Error fetching all Pokémon',
      );
    });
  });

  describe('findOne', () => {
    it('should return a Pokémon', async () => {
      const mockPokemon = { id: '4', name: 'Charmander' };
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await service.findOne('4');
      expect(result).toEqual(mockPokemon);
      expect(model.findOne).toHaveBeenCalledWith({ id: '4' });
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      (model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.findOne('4')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a Pokémon', async () => {
      const updatePokemonDto: UpdatePokemonDto = {
        name: 'Bulbasaur',
        stats: new StatsDto(),
      };
      const mockPokemon = { id: '1', name: 'Bulbasaur' };
      const validObjectId = new Types.ObjectId().toString();
      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPokemon),
      });

      const result = await service.update(validObjectId, updatePokemonDto);
      expect(result).toEqual(mockPokemon);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        validObjectId,
        updatePokemonDto,
        { new: true },
      );
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(
        service.update('invalid', {} as UpdatePokemonDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      const validObjectId = new Types.ObjectId().toString();
      (model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        service.update(validObjectId, {} as UpdatePokemonDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a Pokémon', async () => {
      const validObjectId = new Types.ObjectId().toString();
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({}),
      });

      await service.delete(validObjectId);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(validObjectId);
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(service.delete('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      const validObjectId = new Types.ObjectId().toString();
      (model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(service.delete(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
