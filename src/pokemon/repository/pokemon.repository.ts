/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePokemonDto } from "../dto/create-pokemon.dto";
import { UpdatePokemonDto } from "../dto/update-pokemon.dto";
import { Pokemon, PokemonDocument } from "../interfaces/pokemon.interface";

@Injectable()
export class PokemonRepository {
    constructor(
        @InjectModel('PokedexPokemons') private readonly pokemonModel: Model<PokemonDocument>
    ) {}

    async getAll(): Promise<Pokemon[]> {
        return this.pokemonModel.find().exec();
    }

    async get(id: number): Promise<Pokemon> {
        return this.pokemonModel.findOne({id}).exec();
    }

    async add(createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
        const newPokemon = new this.pokemonModel(createPokemonDto);
        return newPokemon.save();
    }

    async update(id: string, updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
        return this.pokemonModel.findByIdAndUpdate(id, updatePokemonDto, { new: true }).exec();
    }

    async delete(id: string): Promise<void> {
        await this.pokemonModel.findByIdAndDelete(id).exec();
    }
}
