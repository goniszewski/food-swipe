import { Category } from 'src/modules/category/entities/category.schema';
import { Ingredient } from 'src/modules/ingredient/entities/ingredient.schema';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';

// https://www.themealdb.com/api.php
const converter = async (data) => {
  console.log({ data });
  const recipes = data?.hits;

  if (!recipes) {
    return undefined;
  }

  const result: Recipe[] = recipes.map((recipeObject) => {
    const { recipe } = recipeObject;
    const ingredients = <Ingredient[]>recipe.ingredients.map((ingredient) => ({
      item: {
        name: ingredient.food,
      },
      name: ingredient.text,
      amount: Math.round(ingredient.weight),
      unit: ingredient.measure,
      image: ingredient.image,
    }));

    const tags = <string[]>recipe.healthLabels;
    const categories = <Category[]>(
      [recipe.cuisineType, recipe.mealType, recipe.dishType]
        .flat()
        .map((type) => ({ name: type }))
    );

    const isVegetarian = recipe.healthLabels.includes('Vegetarian');
    const isVegan = recipe.healthLabels.includes('Vegan');
    const isGlutenFree = recipe.healthLabels.includes('Gluten-Free');

    return <Recipe>{
      name: recipe.label,
      uri: recipe.uri,
      image: recipe.image,
      servings: recipe.yield,
      preparationTime: recipe.totalTime,
      description: `${Math.round(recipe.calories)} calories, ${
        recipe.cuisineType
      }, ${recipe.mealType}, ${recipe.dishType}.`,
      videoUrl: null,
      instructions: recipe.url,
      ingredients: ingredients,
      categories,
      tags,
      isVegan,
      isVegetarian,
      isGlutenFree,
      author: recipe.source,
      recipeUrl: recipe.url,
      apiName: 'Edamam',
      validated: false,
    };
  });

  return result;
};

export default converter;

