import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from './base';

@Schema()
export class Category extends Base {
  @Prop()
  parent?: Category;

  @Prop()
  icon?: string;

  @Prop()
  description?: string;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
