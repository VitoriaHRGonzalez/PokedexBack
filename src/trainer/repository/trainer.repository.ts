/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateTrainerDto } from "../dto/create-trainer.dto";
import { UpdateTrainerDto } from "../dto/update-trainer.dto";
import { Trainer, TrainerDocument } from "../interfaces/trainer.interface";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TrainerRepository {
    constructor(
        @InjectModel('PokedexTrainers') private readonly trainerModel: Model<TrainerDocument>
    ) {}

    async getAll(): Promise<Trainer[]> {
        return this.trainerModel.find().exec();
    }

    async get(id: number): Promise<Trainer> {
        return this.trainerModel.findOne({id}).exec();
    }

    async add(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
        const newPokemon = new this.trainerModel(createTrainerDto);
        return newPokemon.save();
    }

    async update(id: number, updateTrainerDto: UpdateTrainerDto): Promise<Trainer> {
        return this.trainerModel.findByIdAndUpdate(id, updateTrainerDto, { new: true }).exec();
    }

    async delete(id: number): Promise<void> {
        await this.trainerModel.findByIdAndDelete(id).exec();
    }
}