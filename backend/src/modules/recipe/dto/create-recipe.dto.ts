import { OmitType } from '@nestjs/mapped-types';
import { Recipe } from '../entities/recipe.schema';

export class CreateRecipeDto extends Recipe {}
