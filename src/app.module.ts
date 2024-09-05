/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { TrainerModule } from './trainer/trainer.module';

console.log('MongoDB URI:', process.env.MONGODB_URI); // Adiciona o console.log para verificar a variável de ambiente


@Module({
  imports: [PokemonModule, TrainerModule, MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://localhost:27017/PokedexDB")],
  controllers: [],
  providers: [],
})

export class AppModule {}



