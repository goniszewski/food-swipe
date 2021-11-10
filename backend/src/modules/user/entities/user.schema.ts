import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';
import { Allergens } from 'src/shared/constants/allergens.enum';

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

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: false,
      },
    ],
  })
  favourites?: Recipe[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: false,
      },
    ],
  })
  choicesHistory?: Recipe[];

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Recipe',
        autopopulate: false,
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
  defaultNotRaw?: boolean;

  @Prop()
  allergiesTo?: Allergens[];

  @Prop()
  debug?: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
