import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Item } from 'src/modules/item/entities/item.schema';
import { Category } from '../../category/entities/category.schema';

@Schema()
export class Ingredient {
  @Prop()
  id?: string;

  @Prop()
  name: string;

  @Prop()
  image?: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Item',
    autopopulate: true,
  })
  item: Item;

  @Prop()
  amount: string;

  @Prop()
  unit?: string;

  @Prop()
  notes?: string;

  @Prop()
  isMain?: string;
}

export type IngredientDocument = Ingredient & Document;

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
