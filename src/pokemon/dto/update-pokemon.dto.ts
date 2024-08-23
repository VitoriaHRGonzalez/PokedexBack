/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { StatsDto } from "./stats.dto";

export class UpdatePokemonDto {

    @ApiProperty()
    readonly id?: string;

    @ApiProperty()
    readonly name?: string;

    @ApiProperty()
    readonly type?: string []; //o type é um array, porque há mais de um tipo

    @ApiProperty()
    readonly baseExperience?: number;

    @ApiProperty()
    readonly height?: number;

    @ApiProperty()
    readonly weight?: number;

    @ApiProperty()
    readonly abilities?: string[]; //o abilities é um array, porque há mais de uma habilidade

    // @ApiProperty()
    // readonly image?: string;

    @ApiProperty({type: StatsDto})
    readonly stats: StatsDto;
    
}