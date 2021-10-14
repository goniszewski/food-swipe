import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';
import { Category } from '../../category/entities/category.schema';

@Schema()
export class User {
  @Prop()
  id?: string;

  @Prop({ unique: true, trim: true })
  login: string;

  @Prop({ trim: true })
  name: string;

  @Prop()
  password: string;

  @Prop()
  favourites: number;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: true,
      },
    ],
  })
  choicesHistory?: Recipe[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: true,
      },
    ],
  })
  recommendedRecipes?: Recipe[];

  @Prop()
  defaultVegan?: boolean;

  @Prop()
  defaultVegetarian?: boolean;

  @Prop()
  defaultGlutenFree?: boolean;

  @Prop()
  defaultRaw?: boolean;

  @Prop()
  allergiesTo: string[]; // peanuts, lactose

  @Prop()
  debug?: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
