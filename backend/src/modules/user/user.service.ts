import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeService } from '../recipe/recipe.service';
import { AddChoiceDto } from './dto/add-add-choice.dto';
import { AddRecommendationsDto } from './dto/add-recommendations.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private recipeService: RecipeService,
  ) {}
  public async create(createUserDto: CreateUserDto) {
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
    user.recommendedRecipes = user.recommendedRecipes.filter(
      (rec) => rec.id !== recipe.id,
    );

    return user.save();
  }

  async addRecommendations(userId: string, recommendationIds: string[]) {
    const recipes = await this.recipeService.findByIds(recommendationIds);

    const user = await this.userModel.findById(userId);

    if (recipes?.length === 0) {
      throw new NotFoundException('No recipes found.');
    }

    user.recommendedRecipes = [...user.recommendedRecipes, ...recipes];

    return user.save();
  }

  async addFavoriteRecipe(userId: string, recipeId: string) {
    const user = await this.userModel.findById(userId);
    const recipe = await this.recipeService.findById(recipeId);

    user.favourites.push(recipe);

    return user.save();
  }

  async getChoices(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const { choicesHistory } = await this.userModel.findById(userId).exec();

    return choicesHistory.slice((page - 1) * limit, page * limit);
  }

  async getRecommendations(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const { recommendedRecipes } = await this.userModel.findById(userId).exec();

    return recommendedRecipes.slice((page - 1) * limit, page * limit);
  }

  async getFavoriteRecipes(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const { favourites } = await this.userModel.findById(userId).exec();

    return favourites.slice((page - 1) * limit, page * limit);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}).exec();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByLogin(login: string) {
    return await this.userModel.findOne({ login }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async removeRecommendation(userId: string, recipeId: string) {
    const user = await this.userModel.findById(userId);

    user.recommendedRecipes = user.recommendedRecipes.filter(
      (rec) => rec.id !== recipeId,
    );

    return user.save();
  }

  async removeFavoriteRecipe(userId: string, recipeId: string) {
    const user = await this.userModel.findById(userId);
    user.favourites = user.favourites.filter((rec) => rec.id !== recipeId);

    return user.save();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
