import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoPagination } from '@algoan/nestjs-pagination';

import { CategoryService } from '../category/category.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { ItemService } from '../item/item.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe, RecipeDocument } from './entities/recipe.schema';
import { RecommenderRecipe } from '../recommender/models/recommender-recipe';
import { RecommenderService } from '../recommender/recommender.service';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
    private itemService: ItemService,
    private recommenderService: RecommenderService,
  ) {}
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    try {
      const categories = await Promise.all(
        createRecipeDto.categories.map(async (cat) => {
          const isCat = await this.categoryService.findByName(cat.name);

          if (isCat) {
            return isCat;
          }
          return await this.categoryService.create(cat);
        }),
      );

      const ingredients = await Promise.all(
        createRecipeDto.ingredients.map(async (ing) => {
          let item: any;

          item = await this.itemService.findByName(ing.item.name);

          if (!item) {
            item = await this.itemService.create({ ...ing.item });
          }
          const ingredient = await this.ingredientService.create({
            ...ing,
            item,
          });

          return ingredient;
        }),
      );

      // return new this.recipeModel({
      //   ...createRecipeDto,
      //   categories,
      //   ingredients,
      // }).save();
      return this.recipeModel
        .findOneAndUpdate(
          { name: createRecipeDto.name },
          { $setOnInsert: { ...createRecipeDto, categories, ingredients } },
          { upsert: true, new: true },
        )
        .exec();
    } catch (e) {
      console.error('Error during creation of recipe:', e);
    }
  }

  async findAll(): Promise<RecipeDocument[]> {
    return this.recipeModel.find({}).exec();
  }

  async findAllPaginated(pagination: MongoPagination): Promise<{
    totalResources: number;
    resources: Recipe[];
  }> {
    const resources = await this.recipeModel
      .find({})
      .setOptions(pagination)
      .exec();

    const totalResources = await this.recipeModel
      .count(pagination.filter)
      .exec();

    return { totalResources, resources };
  }

  async findById(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Recipe[]> {
    return this.recipeModel.find({ _id: { $in: ids } }).exec();
  }

  async findByName(name: string) {
    return this.recipeModel.findOne({ name }).exec();
  }

  async findRandomRecipes(
    limit: number,
    userPreferences: {
      allergens: string[];
      isVegan?: boolean;
      isVegetarian?: boolean;
    },
  ): Promise<any[]> {
    const { allergens, ...rest } = userPreferences;

    const recipes = await this.recipeModel
      .aggregate([
        { $match: { ...rest, allergens: { $nin: allergens } } },
        { $sample: { size: limit } },
      ])
      .exec()
      .then(async (recipes) =>
        Promise.all(
          recipes.map(async (recipe) =>
            (
              await (
                await new this.recipeModel(recipe).populate('ingredients')
              ).populate('categories')
            ).toJSON(),
          ),
        ),
      );

    return recipes;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    return this.recipeModel.findByIdAndUpdate(id, updateRecipeDto).exec();
  }

  async remove(id: string) {
    return this.recipeModel.findByIdAndRemove(id);
  }

  async sendRecipesToRecommender(recipes: RecipeDocument[]): Promise<any[]> {
    const recommenderResponses = await this.recommenderService.sendRecipes(
      recipes,
    );

    return recommenderResponses;
  }

  async generaterateRecipesCSV() {
    const recipes = await this.findAll();
    return this.recommenderService.generateRecipesCSV(recipes);
  }
}
