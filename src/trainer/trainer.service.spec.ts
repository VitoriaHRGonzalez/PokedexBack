import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pokemon } from 'src/pokemon/interfaces/pokemon.interface';
import { PokemonRepository } from '../pokemon/repository/pokemon.repository';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { TrainerDto } from './dto/trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainerRepository } from './repository/trainer.repository';
import { TrainerService } from './trainer.service';

const mockTrainerRepository = {
  getAll: jest.fn(),
  get: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
};

const mockPokemonRepository = {
  get: jest.fn(),
};

describe('TrainerService', () => {
  let service: TrainerService;
  let trainerRepository;
  let pokemonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainerService,
        { provide: TrainerRepository, useValue: mockTrainerRepository },
        { provide: PokemonRepository, useValue: mockPokemonRepository },
      ],
    }).compile();

    service = module.get<TrainerService>(TrainerService);
    trainerRepository = module.get<TrainerRepository>(TrainerRepository);
    pokemonRepository = module.get<PokemonRepository>(PokemonRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of TrainerDto', async () => {
      const mockTrainers = [
        {
          id: 1,
          name: 'Vitoria',
          pokemons: [3, 4, 5],
          imageUrl:
            'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
        },
      ];
      const mockPokemons = [
        { id: 3, name: 'Venusaur' },
        { id: 4, name: 'Charmander' },
        { id: 5, name: 'Charmeleon' },
      ];
      trainerRepository.getAll.mockResolvedValue(mockTrainers);
      pokemonRepository.get.mockImplementation((id) => {
        return mockPokemons.find((pokemon) => pokemon.id === id);
      });

      const result = await service.findAll();
      expect(result).toEqual([
        new TrainerDto(
          1,
          'Vitoria',
          mockPokemons as unknown as Pokemon[],
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
        ),
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a TrainerDto', async () => {
      const mockTrainer = {
        id: 1,
        name: 'Vitoria',
        pokemons: [3, 4, 5],
        imageUrl:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
      };
      const mockPokemons = [
        { id: 3, name: 'Venusaur' },
        { id: 4, name: 'Charmander' },
        { id: 5, name: 'Charmeleon' },
      ];
      trainerRepository.get.mockResolvedValue(mockTrainer);
      pokemonRepository.get.mockImplementation((id) => {
        return mockPokemons.find((pokemon) => pokemon.id === id);
      });

      const result = await service.findOne(1);
      expect(result).toEqual(
        new TrainerDto(
          1,
          'Vitoria',
          mockPokemons as unknown as Pokemon[],
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
        ),
      );
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid' as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if Trainer is not found', async () => {
      trainerRepository.get.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new Trainer', async () => {
      const createTrainerDto: CreateTrainerDto = {
        name: 'Vitoria',
        pokemons: [3, 4, 5],
        imageUrl:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
      };
      const mockTrainer = { id: 1, ...createTrainerDto };
      trainerRepository.add.mockResolvedValue(mockTrainer);

      const result = await service.create(createTrainerDto);
      expect(result).toEqual(mockTrainer);
    });
  });

  describe('update', () => {
    it('should update a Trainer', async () => {
      const updateTrainerDto: UpdateTrainerDto = {
        name: 'Mateus',
        pokemons: [8, 10, 16],
        imageUrl:
          'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg',
      };
      trainerRepository.update.mockResolvedValue(undefined);
      await expect(
        service.update('1', updateTrainerDto),
      ).resolves.toBeUndefined();
      expect(trainerRepository.update).toHaveBeenCalledWith(
        1,
        updateTrainerDto,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpar os mocks entre os testes
  });

  // test about pokemons for a trainer
  describe('fetching pokemons for a trainer', () => {
    it('should fetch all pokemons for a given trainer', async () => {
      const mockTrainer = {
        id: 1,
        name: 'Vitoria',
        pokemons: [3, 4, 5],
        imageUrl: 'some-url',
      };

      const mockPokemons: Pokemon[] = [
        { id: 3, name: 'Venusaur' } as unknown as Pokemon,
        { id: 4, name: 'Charmander' } as unknown as Pokemon,
        { id: 5, name: 'Charmeleon' } as unknown as Pokemon,
      ];

      trainerRepository.get.mockResolvedValue(mockTrainer);

      mockPokemons.forEach((pokemon) => {
        pokemonRepository.get.mockResolvedValueOnce(pokemon);
      });

      const result = await service.findOne(1);

      expect(pokemonRepository.get).toHaveBeenCalledTimes(3);
      expect(pokemonRepository.get).toHaveBeenCalledWith(4);
      expect(pokemonRepository.get).toHaveBeenCalledWith(5);
      expect(pokemonRepository.get).toHaveBeenCalledWith(3);

      expect(result.pokemons).toEqual(mockPokemons);
    });
  });
});
