/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PokemonRepository } from "src/pokemon/repository/pokemon.repository";
import { CreateTrainerDto } from "./dto/create-trainer.dto";
import { TrainerDto } from "./dto/trainer.dto";
import { UpdateTrainerDto } from "./dto/update-trainer.dto";
import { Trainer } from "./interfaces/trainer.interface";
import { TrainerRepository } from "./repository/trainer.repository";

@Injectable()
export class TrainerService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
    private readonly pokemonRepository: PokemonRepository
  ) {}

  async findAll(): Promise<TrainerDto[]> {
    const trainers = await this.trainerRepository.getAll();
    const trainersDto = await Promise.all(
      trainers.map(async (trainer) => {
        const pokemons = await Promise.all(
          trainer.pokemons.map(pokemonId => this.pokemonRepository.get(pokemonId))
        );
        return new TrainerDto(trainer.id, trainer.name, pokemons, trainer.imageUrl);
      })
    );
    return trainersDto;
  }

  async findOne(id: number): Promise<TrainerDto> {
    if (isNaN(Number(id))) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const trainer = await this.trainerRepository.get(Number(id));
    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${id} not found`);
    }
    const pokemons = await Promise.all(
      trainer.pokemons.map(pokemonId => this.pokemonRepository.get(pokemonId))
    );
    console.log(pokemons);
    return new TrainerDto(trainer.id, trainer.name, pokemons, trainer.imageUrl);
  }

  async create(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    return this.trainerRepository.add(createTrainerDto);
  }

  async update(id: string, updateTrainerDto: UpdateTrainerDto): Promise<void> {
    await this.trainerRepository.update(Number(id), updateTrainerDto);
  }
}
