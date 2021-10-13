import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Base } from '../entities/base.entity';

@Schema()
export class Item extends Base {
  @Prop()
  isVegan?: boolean;

  @Prop()
  isVegetarian?: boolean;

  @Prop()
  isAllergen?: boolean;
}

export type ItemDocument = Item & Document;

export const ItemSchema = SchemaFactory.createForClass(Item);
