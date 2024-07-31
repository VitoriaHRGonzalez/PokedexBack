/* eslint-disable prettier/prettier */
export interface Pokemon {
    id:string;
    name: string;
    type: string [];
    baseExperience: number;
    height: number;
    weight: number;
    abilities: string[];
    image?: string;
    stats: {
        hp:number;
        attack: number;
        defense: number;
        speed: number;
    };
};

export interface PokemonDocument extends Document {
    id: number;
    name: string;
    type: string[];
    baseExperience: number;
    height: number;
    weight: number;
    abilities: string[];
    image?: string;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      speed: number;
    };
  }