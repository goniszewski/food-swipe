import { Item } from 'src/modules/item/entities/item.schema';

export class Ingredient {
  name: string;
  image?: string;
  item: Item;
  amount: number | string;
  unit?: Unit | string;
  notes?: string[]; // czy pokrojone, zmielone
  isMain?: boolean;
}

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
