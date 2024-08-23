import { Schema } from 'mongoose';

export const PokemonSchema = new Schema({
  id: Number,
  name: String,
  type: [String],
  baseExperience: Number,
  height: Number,
  weight: Number,
  abilities: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  // image: String,
});
