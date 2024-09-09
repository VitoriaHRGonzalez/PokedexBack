/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';


@ApiTags('pokemon') //O decorator @ApiTags é utilizado para adicionar tags a documentação gerada pelo Swagger.
@Controller('pokemon')

export class PokemonController{
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(id);
  }

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto){
    return this.pokemonService.create(createPokemonDto);
  }

  @Put (':id')
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto){
    this.pokemonService.update(id, updatePokemonDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string){
    this.pokemonService.delete(id);
  }





  // Continuar implementando a partir do Post.

}


// Responsável pelas operações de cada classe, lidam com as requisições HTTP.
//  Atuam como intermediárias entre o front-end e a camada de serviço.

