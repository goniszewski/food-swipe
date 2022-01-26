import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient, IngredientDocument } from './entities/ingredient.schema';

@Injectable()
export class IngredientService {
  constructor(
    @InjectModel(Ingredient.name)
    private ingredientModel: Model<IngredientDocument>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    // return new this.ingredientModel(createIngredientDto).save();
    return this.ingredientModel
      .findOneAndUpdate(
        { name: createIngredientDto.name },
        { $setOnInsert: createIngredientDto },
        { upsert: true, new: true },
      )
      .exec();
  }

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientModel.find({}).exec();
  }

  async findById(id: string): Promise<Ingredient> {
    return this.ingredientModel.findById(id).exec();
  }

  async findByName(name: string) {
    return this.ingredientModel.findOne({ name }).exec();
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientModel
      .findByIdAndUpdate(id, updateIngredientDto)
      .exec();
  }

  async remove(id: string) {
    return this.ingredientModel.findByIdAndRemove(id);
  }
}
