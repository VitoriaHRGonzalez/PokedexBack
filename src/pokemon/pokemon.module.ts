/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonController } from './pokemon.controller';
import { PokemonSchema } from './pokemon.schema';
import { PokemonService } from './pokemon.service';
import { PokemonRepository } from './repository/pokemon.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'pokedexpokemons', schema: PokemonSchema }]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository],
  exports: [MongooseModule],
})
export class PokemonModule {}
