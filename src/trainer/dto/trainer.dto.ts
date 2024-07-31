/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { Pokemon } from "src/pokemon/interfaces/pokemon.interface";

export class TrainerDto {
    constructor(id: number, name: string, pokemons: Pokemon[], imageUrl: string){
        this.id = id;
        this.name = name;
        this.pokemons = pokemons;
        this.imageUrl = imageUrl;
    }

    @ApiProperty()
    readonly id:number;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly pokemons: Pokemon[];

    @ApiProperty()
    readonly imageUrl: string;
}