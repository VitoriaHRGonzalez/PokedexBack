/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTrainerDto } from "./dto/create-trainer.dto";
import { UpdateTrainerDto } from "./dto/update-trainer.dto";
import { TrainerService } from "./trainer.service";


@ApiTags('trainer')
@Controller('trainer')
export class TrainerController {
    constructor(private readonly trainerService: TrainerService) { }

    @Get()
    findAll () {
        return this.trainerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        const objectId = Number(id);
        if (!objectId) {
            throw new Error('Invalid ID format');
        }
        return this.trainerService.findOne(objectId);
    }
    @Post()
    create(@Body() createTrainerDto: CreateTrainerDto) {
        return this.trainerService.create(createTrainerDto);
    }

    @Put (':id')
    update(@Param('id') id: string, @Body() updateTrainerDto: UpdateTrainerDto) {
        this.trainerService.update(id, updateTrainerDto);
    }
}