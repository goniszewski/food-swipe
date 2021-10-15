import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';

@Schema({
  // toJSON: {
  //   virtuals: true,
  //   versionKey: false,
  //   transform: function (doc, ret) {
  //     ret.id = ret._id;
  //     delete ret.password;
  //   },
  // },
  // toObject: {
  //   virtuals: true,
  //   getters: true,
  //   transform: function (doc, ret) {
  //     ret.id = ret._id;
  //     delete ret.password;
  //   },
  // },
})
export class User {
  @Prop()
  id?: string;

  @Prop({ unique: true, trim: true })
  login: string;

  @Prop({ trim: true })
  name: string;

  @Prop({ private: true })
  password: string;

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: true,
      },
    ],
  })
  favourites: Recipe[];

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
