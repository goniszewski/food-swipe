import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Base } from './base';
import { Item } from './item.schema';

@Schema()
export class Ingredient extends Base {
  @Prop()
  image?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Item' })
  item: Item;

  @Prop()
  amount: number | string;

  @Prop()
  unit: Unit | string | null;

  @Prop([String])
  notes?: string[]; // czy pokrojone, zmielone

  @Prop()
  isMain?: boolean;
}

export type IngredientDocument = Ingredient & Document;

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);

export enum Unit {
  KG_LONG = 'kilograms',
  KG = 'kg',
  G_LONG = 'grams',
  G = 'g',
  L_LONG = 'litres',
  L = 'l',
  ML_LONG = 'mililitres',
  ML = 'ml',
}
