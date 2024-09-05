/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { TrainerModule } from './trainer/trainer.module';

@Module({
  imports: [PokemonModule, TrainerModule, MongooseModule.forRoot('mongodb+srv://vitoriagonzalez:p0CmCvoHROLcwQvB@cluster0.dkbwg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')],
  controllers: [],
  providers: [],
})

export class AppModule {}



