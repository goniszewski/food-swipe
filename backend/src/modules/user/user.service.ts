import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeService } from '../recipe/recipe.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private recipeService: RecipeService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = <User>await new this.userModel(createUserDto).save();
    return user;
  }

  async addChoice(userId: string, recipeId: string) {
    const recipe = await this.recipeService.findById(recipeId);
    const user = await this.userModel.findById(userId);

    if (!recipe) {
      throw new Error(`Recipe with id ${recipeId} doesn't exist.`);
    }

    user.choicesHistory.push(recipe);

    return user.save();
  }

  findAll() {
    return `This action returns all user`;
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
