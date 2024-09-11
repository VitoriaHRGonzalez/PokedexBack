/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PokemonModule } from "src/pokemon/pokemon.module";
import { PokemonRepository } from "src/pokemon/repository/pokemon.repository";
import { TrainerRepository } from "./repository/trainer.repository";
import { TrainerController } from "./trainer.controller";
import { TrainerSchema } from "./trainer.schema";
import { TrainerService } from "./trainer.service";

@Module({
    imports: [PokemonModule, MongooseModule.forFeature([{ name: 'pokedextrainers', schema: TrainerSchema }]),],
    controllers:[TrainerController],
    providers: [TrainerService, TrainerRepository, PokemonRepository],
})
export class TrainerModule { }