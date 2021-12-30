import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InteractionEventTypes } from 'src/shared/constants/interaction-event-types.enum';
import { InteractionSources } from 'src/shared/constants/interaction-sources.enum';
import { Recipe } from '../recipe/entities/recipe.schema';
import { RecipeService } from '../recipe/recipe.service';
import { RecommenderChoice } from '../recommender/models/recommender-choice';
import { RecommenderUser } from '../recommender/models/recommender-user';
import { RecommenderService } from '../recommender/recommender.service';
import { AddUserRecipeInteractionDto } from './dto/add-user-recipe-interaction.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
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

  async getPreferences(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} doesn't exist.`);
    }

    const preferences = { allergens: user.allergyTo };

    if (user.defaultVegan) preferences['isVegan'] = true;
    if (user.defaultVegetarian) preferences['isVegetarian'] = true;

    return preferences;
  }
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

    // const recommenderResponse = await this.recommenderService.sendChoice(
    //   choice,
    // );

    // if (recommenderResponse?.$metadata.httpStatusCode !== 200) {
    //   console.error(
    //     `Encountered an error while adding choice ${choice.id} to Recommender.`,
    //   );
    // }

    user.recommendedRecipes = user.recommendedRecipes.filter(
      (rec) => rec.id !== recipe.id,
    );

    return user.save();
  }

  async generateRandomChoices(userIds: string[], randomChoices: number) {
    const users = await this.userModel.find({ login: { $in: userIds } }).exec();

    if (users.length === 0) {
      throw new NotFoundException('No users found.');
    }

    const choices = await Promise.all(
      users.map(async (user) => {
        const randomRecipes = await this.recipeService.findRandomRecipes(
          randomChoices,
          {
            allergens: user.allergyTo,
            isVegan: user.defaultVegan,
            isVegetarian: user.defaultVegetarian,
          },
        );

        const choicesResponses = await Promise.all(
          randomRecipes.map(async (recipe) => {
            // const recipe = await this.recipeService.findById(recipeId);
            const choice = await new Promise((resolve, reject) => {
              // setTimeout(() => {
              this.addChoice({
                userId: user._id,
                recipeId: recipe.id,
                source: InteractionSources.BACKEND,
                timestamp: new Date(),
              })
                .then(resolve)
                .catch(reject);
              // }, 1000);
            });

            return choice;
          }),
        );

        return choicesResponses;
      }),
    );

    return choices;
  }

  async generateCSVOfAllChoices() {
    const choices = await this.userRecipeInteractionModel
      .find({ eventType: InteractionEventTypes.CHOICE })
      .populate('user')
      .populate('recipe')
      .exec();

    return this.recommenderService.generateChoicesCSV(choices);
  }

  async generateUsersCSV() {
    const users = await this.userModel.find().exec();

    return this.recommenderService.generateUsersCSV(users);
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

    const favorite = await new this.userRecipeInteractionModel({
      user,
      recipe,
      timestamp,
      source,
      eventType: InteractionEventTypes.FAVORITE,
    }).save();

    const favoritedRecipes = this.userRecipeInteractionModel
      .find({
        eventType: InteractionEventTypes.FAVORITE,
        user: user._id,
      })
      .populate('recipe')
      .exec()
      .then((favoritedRecipes) =>
        favoritedRecipes.map((recipe) => recipe.recipe),
      );

    return favoritedRecipes;
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
    const user: any = await this.findById(userId);

    if (!user.recommendedRecipes || user.recommendedRecipes.length === 0) {
      const recommendations =
        await this.recommenderService.getRecommendationsForUser(userId);

      user.recommendedRecipes = Object.keys(recommendations);
      user.save();

      console.log({ recommendations });

      return this.userModel
        .findById(userId)
        .populate('recommendedRecipes')
        .exec()
        .then((user) => user.recommendedRecipes);
    }
    const { recommendedRecipes } = await user.populate('recommendedRecipes');

    return recommendedRecipes.slice((page - 1) * limit, page * limit);
  }

  async getRecommendationsOrRandom(
    userId: string,
    { page = 1, limit = 20 }: { page: number; limit: number },
  ) {
    const recommendations = await this.getRecommendations(userId, {
      page,
      limit,
    });

    if (recommendations.length === 0) {
      const userPreferences = await this.getPreferences(userId);

      const randomRecipes = await this.recipeService.findRandomRecipes(
        limit,
        userPreferences,
      );

      await this.userModel
        .findByIdAndUpdate(userId, {
          $push: {
            recommendedRecipes: randomRecipes.map((recipe) => recipe.id),
          },
        })
        .exec();

      return randomRecipes;
    }
    return recommendations;
  }

  async updateRecommendations(userId: string) {
    const recommenderResponse =
      await this.recommenderService.getRecommendationsForUser(userId);

    const updateUserRecommendations = await this.addRecommendations(
      userId,
      Object.keys(recommenderResponse),
    );

    return updateUserRecommendations.recommendedRecipes;
  }

  async updatePreferences(
    userId: string,
    preferences: UpdateUserPreferencesDto,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, preferences, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} doesn't exist.`);
    }

    return user;
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

      .exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
  }

  async removeRecommendation(userId: string, recipeId: string) {
    const user: any = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with id ${userId} doesn't exist.`);
    }
    console.log(user.recommendedRecipes);
    user.recommendedRecipes = user.recommendedRecipes.filter(
      (rec) => rec !== recipeId,
    );

    return user.save();

    // return user.toJSON();
  }

  async removeFavoriteRecipe(userId: string, recipeId: string) {
    const user = await this.userModel.findById(userId);
    const recipe = await this.recipeService.findById(recipeId);

    const removed = await this.userRecipeInteractionModel
      .deleteOne({ user, recipe, eventType: InteractionEventTypes.FAVORITE })
      .exec();

    console.log(removed);

    const favoritedRecipes = this.userRecipeInteractionModel
      .find({
        eventType: InteractionEventTypes.FAVORITE,
        user: user._id,
      })
      .populate('recipe')
      .exec()
      .then((favoritedRecipes) =>
        favoritedRecipes.map((recipe) => recipe.recipe),
      );

    return favoritedRecipes;
  }

  async remove(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }
}
