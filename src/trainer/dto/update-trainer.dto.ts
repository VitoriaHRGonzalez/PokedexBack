/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTrainerDto {
    // @ApiProperty()
    // readonly id?: string;

    @ApiProperty()
    readonly name?: string;

    @ApiProperty({type: [Number]})
    readonly pokemons?: number[];

    @ApiProperty()
    readonly imageUrl?: string;
}