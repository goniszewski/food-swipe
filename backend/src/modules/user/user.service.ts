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

  async findAll(): Promise<User[]> {
    return this.userModel.find({}).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByLogin(login: string) {
    return this.userModel.findOne({ login }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
