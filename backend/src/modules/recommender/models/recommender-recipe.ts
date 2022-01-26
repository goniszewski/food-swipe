export interface RecommenderRecipe {
  ITEM_ID: string;
  // SERVINGS: number;
  // CALORIES_PER_SERVING: number;
  PREPARATION_TIME: number | string | null;
  // DESCRIPTION: string;
  INGREDIENTS: string[];
  CATEGORIES: string[];
  TAGS: string[];
  VEGAN: boolean;
  VEGETARIAN: boolean;
  GLUTEN_FREE: boolean;
  AUTHOR: string;
}
