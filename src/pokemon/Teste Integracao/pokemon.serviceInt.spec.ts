import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types } from 'mongoose';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { PokemonDocument } from '../interfaces/pokemon.interface';
import { PokemonSchema } from '../pokemon.schema';
import { PokemonService } from '../pokemon.service';

describe('PokemonService', () => {
  let service: PokemonService;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let pokemonModel: Model<PokemonDocument>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: 'PokedexPokemons', schema: PokemonSchema },
        ]),
      ],
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    connection = module.get<Connection>('DatabaseConnection');
    pokemonModel = module.get<Model<PokemonDocument>>(
      getModelToken('PokedexPokemons'),
    );
  });

  //Limpa o ambiente após todos os testes, encerrando a conexão do Mongo em memória.
  afterAll(async () => {
    await connection.close();
    await mongod.stop();
  });

  //Limpa os dados após cada teste.
  afterEach(async () => {
    await pokemonModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Pokémon', async () => {
      await new pokemonModel({
        id: '4',
        name: 'Charmander',
        type: ['Fire'],
      }).save();
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual('Charmander');
    });
  });

  describe('findOne', () => {
    it('should return a Pokémon', async () => {
      const createdPokemon = await new pokemonModel({
        id: '4',
        name: 'Charmander',
        type: 'Fire',
      }).save();
      const result = await service.findOne('4');
      expect(result.name).toEqual(createdPokemon.name);
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new Pokémon', async () => {
      const dto: CreatePokemonDto = {
        id: '4',
        name: 'Charmander',
        type: ['Fire'],
        baseExperience: 0,
        height: 0,
        weight: 0,
        abilities: [],
        stats: { hp: 0, attack: 0, defense: 0, speed: 0 },
      };
      const result = await service.create(dto);
      expect(result.name).toEqual('Charmander');
    });
  });

  describe('update', () => {
    it('should update and return a Pokémon', async () => {
      const createdPokemon = await new pokemonModel({
        id: '4',
        name: 'Charmander',
        type: 'Fire',
      }).save();
      const dto: UpdatePokemonDto = {
        name: '?',
        stats: { hp: 0, attack: 0, defense: 0, speed: 0 },
      };
      const result = await service.update(createdPokemon._id.toString(), dto);
      expect(result.name).toEqual('?');
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(
        service.update('invalid', {} as UpdatePokemonDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      const validObjectId = new Types.ObjectId().toString();
      await expect(
        service.update(validObjectId, {} as UpdatePokemonDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a Pokémon', async () => {
      const createdPokemon = await new pokemonModel({
        id: '1',
        name: 'Charmander',
        type: 'Fire',
      }).save();
      await service.delete(createdPokemon._id.toString());
      const result = await pokemonModel.findById(createdPokemon._id).exec();
      expect(result).toBeNull();
    });

    it('should throw a BadRequestException for invalid ID', async () => {
      await expect(service.delete('invalid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if Pokémon is not found', async () => {
      const validObjectId = new Types.ObjectId().toString();
      await expect(service.delete(validObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
