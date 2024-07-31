/* eslint-disable prettier/prettier */
export interface Trainer {
    id: number;
    name: string;
    pokemons: number [];
    imageUrl: string
}

export interface TrainerDocument extends Document {
    id: number;
    name: string;
    pokemons: number [];
    imageUrl: string
}