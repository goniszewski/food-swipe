import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { ItemService } from '../item/item.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe, RecipeDocument } from './entities/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
    private itemService: ItemService,
  ) {}
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const exist = await this.recipeModel.findOne({
      name: createRecipeDto.name,
    });

    if (exist) {
      throw new ConflictException(
        `Recipe with name '${createRecipeDto.name}' already exist.`,
      );
    }

    const categories = await Promise.all(
      createRecipeDto.categories.map(async (cat) => {
        const isCat = await this.categoryService.findByName(cat.name);

        if (!isCat) {
          const newCat = await this.categoryService.create(cat);
          return newCat;
        }
        return isCat;
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

    return new this.recipeModel({
      ...createRecipeDto,
      categories,
      ingredients,
    }).save();
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find({}).exec();
  }

  async findById(id: string): Promise<Recipe> {
    return this.recipeModel.findById(id).exec();
  }

  async findByName(name: string) {
    return this.recipeModel.findOne({ name }).exec();
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    return this.recipeModel.findByIdAndUpdate(id, updateRecipeDto).exec();
  }

  async remove(id: string) {
    return this.recipeModel.findByIdAndRemove(id);
  }
}
