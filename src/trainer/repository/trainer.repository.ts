import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainerDto } from '../dto/create-trainer.dto';
import { UpdateTrainerDto } from '../dto/update-trainer.dto';
import { Trainer, TrainerDocument } from '../interfaces/trainer.interface';

@Injectable()
export class TrainerRepository {
  constructor(
    @InjectModel('pokedextrainers')
    private readonly trainerModel: Model<TrainerDocument>,
  ) {}

  async getAll(): Promise<Trainer[]> {
    return await this.trainerModel.find().exec();
  }

  async get(id: number): Promise<Trainer> {
    return await this.trainerModel.findOne({ id }).exec();
  }

  async add(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    const newTrainer = new this.trainerModel(createTrainerDto);
    return await newTrainer.save();
  }

  async update(
    id: number,
    updateTrainerDto: UpdateTrainerDto,
  ): Promise<Trainer> {
    return await this.trainerModel
      .findByIdAndUpdate(id, updateTrainerDto, { new: true })
      .exec();
  }

  async delete(id: number): Promise<void> {
    await this.trainerModel.findByIdAndDelete(id).exec();
  }
}
