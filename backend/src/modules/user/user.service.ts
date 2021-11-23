import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InteractionEventTypes } from 'src/shared/constants/interaction-event-types.enum';
import { Recipe } from '../recipe/entities/recipe.schema';
import { RecipeService } from '../recipe/recipe.service';
import { RecommenderChoice } from '../recommender/models/recommender-choice';
import { RecommenderUser } from '../recommender/models/recommender-user';
import { RecommenderService } from '../recommender/recommender.service';
import { AddUserRecipeInteractionDto } from './dto/add-user-recipe-interaction.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserRecipeInteraction,
  UserRecipeInteractionDocument,
} from './entities/user-recipe-interaction.schema';
import { User, UserDocument } from './entities/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRecipeInteraction.name)
    private userRecipeInteractionModel: Model<UserRecipeInteractionDocument>,
    private recipeService: RecipeService,
    private recommenderService: RecommenderService,
  ) {}
  public async create(createUserDto: CreateUserDto) {
    const user = await new this.userModel(createUserDto).save();

    const recommenderResponse = await this.recommenderService.sendUser(user);

    if (!recommenderResponse) {
      console.error(`User ${user.id} was not added to Recommender.`);
    }

    return user;
  }

  async addChoice({
    userId,
    recipeId,
    timestamp = new Date(),
    source,
  }: AddUserRecipeInteractionDto) {
    const recipe = await this.recipeService.findById(recipeId);
    const user = await this.userModel.findById(userId);

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${recipeId} doesn't exist.`);
    }

    const choice = await new this.userRecipeInteractionModel({
      user,
      recipe,
      timestamp,
      source,
      eventType: InteractionEventTypes.CHOICE,
    }).save();

    if (!choice) {
      throw new InternalServerErrorException(
        `Couldn't add recipe with id ${recipeId} as choice in DB.`,
      );
    }

    const recommenderResponse = await this.recommenderService.sendChoice(
      choice,
    );

    if (!recommenderResponse) {
      console.error(`Choice ${choice.id} was not added to Recommender.`);
    }

    user.recommendedRecipes = user.recommendedRecipes.filter(
      (rec) => rec.id !== recipe.id,
    );

    return user.save();
  }

  async addFavoriteRecipe({
    userId,
    recipeId,
    timestamp = new Date(),
    source,
  }: AddUserRecipeInteractionDto) {
    const user = await this.userModel.findById(userId);
    const recipe = await this.recipeService.findById(recipeId);

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${recipeId} doesn't exist.`);
    }

    const favourite = await new this.userRecipeInteractionModel({
      user,
      recipe,
      timestamp,
      source,
      eventType: InteractionEventTypes.FAVORITE,
    }).save();

    return favourite;
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

  async getChoices(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} doesn't exist.`);
    }

    const choiceInteractions = await this.userRecipeInteractionModel
      .find({ user, eventType: InteractionEventTypes.CHOICE })
      .populate('recipe')
      .exec();

    const choicesHistory = choiceInteractions.map(
      (interaction) => interaction.recipe,
    );

    return choicesHistory.slice((page - 1) * limit, page * limit);
  }

  async getFavoriteRecipes(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} doesn't exist.`);
    }

    const favouriteIntreractions = await this.userRecipeInteractionModel
      .find({ user, eventType: InteractionEventTypes.FAVORITE })
      .populate('recipe')
      .exec();

    const favourites = favouriteIntreractions.map(
      (interaction) => interaction.recipe,
    );

    return favourites.slice((page - 1) * limit, page * limit);
  }

  async getRecommendations(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const { recommendedRecipes } = await this.userModel
      .findById(userId)
      .populate('recommendations')
      .exec();

    return recommendedRecipes.slice((page - 1) * limit, page * limit);
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByLogin(login: string) {
    return await this.userModel.findOne({ login }).exec();
  }

  async findAllInteractionsByType(type: InteractionEventTypes) {
    return await this.userRecipeInteractionModel
      .find({ eventType: type })
      .populate('user')
      .populate('recipe')
      .exec();
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
    const recipe = await this.recipeService.findById(recipeId);

    await this.userRecipeInteractionModel
      .deleteOne({ user, recipe, eventType: InteractionEventTypes.FAVORITE })
      .exec();

    return user.save();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
