import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Base } from './base';
import { Category } from './category.schema';
import { Ingredient } from './ingredient.schema';

@Schema()
export class Recipe extends Base {
  @Prop()
  uri: string;

  @Prop()
  image: string;

  @Prop()
  servings: number;

  @Prop()
  caloriesPerServing?: number;

  @Prop()
  preparationTime: number;

  @Prop({ trim: true })
  description: string;

  @Prop({ trim: true })
  instructions?: string;

  @Prop({ trim: true })
  videoUrl?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Ingredient' }] })
  ingredients: Ingredient[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[] | [];

  @Prop()
  isVegan?: boolean;

  @Prop()
  isVegetarian?: boolean;

  @Prop()
  isCheap?: boolean;

  @Prop()
  isGlutenFree?: boolean;

  @Prop()
  author: string;

  @Prop()
  recipeUrl: string;

  @Prop()
  apiName?: string;

  @Prop()
  apiAttributionHTML?: string;
}

export type RecipeDocument = Recipe & Document;

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

export class Tag extends Base {}
