import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Ingredient } from 'src/modules/ingredient/entities/ingredient.schema';
import { Category } from '../../category/entities/category.schema';

@Schema()
export class Recipe {
  @Prop()
  id?: string;

  @Prop({ trim: true })
  name: string;

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

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Ingredient',
        autopopulate: true,
      },
    ],
  })
  ingredients: Ingredient[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Category',
        autopopulate: true,
      },
    ],
  })
  categories: Category[];

  @Prop([String])
  tags: string[];

  @Prop()
  isVegan?: boolean;

  @Prop()
  isVegetarian?: boolean;

  @Prop()
  isGlutenFree?: boolean;

  @Prop()
  allergens?: string[]; // TODO populate allergens based on item's 'isAllergen'

  @Prop()
  author: string;

  @Prop()
  recipeUrl: string;

  @Prop()
  apiName?: string;

  @Prop()
  apiAttributionHTML?: string;

  @Prop({ default: false })
  validated: boolean;
}

export type RecipeDocument = Recipe & Document;

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
