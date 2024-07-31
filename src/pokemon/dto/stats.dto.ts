/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class StatsDto {

    @ApiProperty()
    hp: number;

    @ApiProperty()
    attack: number;

    @ApiProperty()
    defense: number;

    @ApiProperty()
    speed: number;
}