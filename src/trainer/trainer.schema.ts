import { Schema } from 'mongoose';

export const TrainerSchema = new Schema({
  id: Number,
  name: String,
  pokemons: [String],
  imageUrl: String,
});
// Colocar as informações conforme consta no BD.
