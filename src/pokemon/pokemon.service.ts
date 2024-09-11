/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PokemonDocument } from './interfaces/pokemon.interface';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel('pokedexpokemons') private readonly pokemonModel: Model<PokemonDocument>
  ) {}

  async findAll(): Promise<Pokemon[]> {
    try {
      return await this.pokemonModel.find().exec();
    } catch (error) {
      throw new Error('Error fetching all Pokémon');
    }
  }

  async findOne(id: string): Promise<Pokemon> {
    if (!Number(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  
    const pokemon = await this.pokemonModel.findOne({id}).exec();
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }
    return pokemon;
  }
  
  async create(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    try {
      const newPokemon = new this.pokemonModel(createPokemonDto);
      return await newPokemon.save();
    } catch (error) {
      throw new Error('Error creating new Pokémon');
    }
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(id, updatePokemonDto, { new: true }).exec();
    if (!updatedPokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }
    return updatedPokemon;
  }

  async delete(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const result = await this.pokemonModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }
  }
}
