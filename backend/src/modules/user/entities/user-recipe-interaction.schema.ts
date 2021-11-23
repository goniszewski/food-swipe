import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';
import { InteractionEventTypes } from 'src/shared/constants/interaction-event-types.enum';
import { InteractionSources } from 'src/shared/constants/interaction-sources.enum';
import { User } from './user.schema';

@Schema()
export class UserRecipeInteraction {
  @Prop()
  id?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    autopopulate: false,
  })
  user: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Recipe',
    autopopulate: false,
  })
  recipe: Recipe;

  @Prop()
  timestamp: Date;

  @Prop()
  eventType: InteractionEventTypes;

  @Prop()
  source: InteractionSources;
}

export type UserRecipeInteractionDocument = UserRecipeInteraction & Document;

export const UserRecipeInteractionSchema = SchemaFactory.createForClass(
  UserRecipeInteraction,
);
