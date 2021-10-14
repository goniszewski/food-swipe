import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe, RecipeDocument } from './entities/recipe.schema';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    private categoryService: CategoryService,
  ) {}
  async create(createRecipeDto: CreateRecipeDto) {
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

    const recipe = <Recipe>await new this.recipeModel({
      ...createRecipeDto,
      categories,
    }).save();

    return recipe;
  }

  findAll() {
    return `This action returns all recipe`;
  }

  findOne(id: string) {
    return this.recipeModel.findById(id);
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
