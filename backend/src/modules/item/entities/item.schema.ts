import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Item {
  @Prop()
  id?: string;

  @Prop({ unique: true, trim: true })
  name: string;

  @Prop()
  isVegan?: boolean;

  @Prop()
  isVegetarian?: boolean;

  @Prop()
  isAllergen?: boolean;

  @Prop()
  isGlutenFree?: boolean;
}

export type ItemDocument = Item & Document;

export const ItemSchema = SchemaFactory.createForClass(Item);
