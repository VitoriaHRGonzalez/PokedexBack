/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { TrainerModule } from './trainer/trainer.module';

@Module({
  imports: [PokemonModule, TrainerModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://vitoriagonzalez:OgwNE2emoWL4aG82@cluster0.qfg5s.mongodb.net/Pokedex?retryWrites=true&w=majority&appName=Cluster0'),
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
