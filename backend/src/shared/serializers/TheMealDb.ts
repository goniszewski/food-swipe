import { Ingredient } from 'src/modules/ingredient/entities/ingredient.schema';
import { Recipe } from 'src/modules/recipe/entities/recipe.schema';

// https://www.themealdb.com/api.php
const converter = (data) => {
  const meals = data?.meals;

  if (!meals) {
    return undefined;
  }

  const result: Recipe[] = meals.map((meal) => {
    const ingredients = <Ingredient[]>[];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];

      if (ingredient && ingredient !== ('' || ' ')) {
        ingredients.push({
          item: {
            name: null,
          },
          name: ingredient.toLowerCase(),
          amount: `${meal[`strMeasure${i}`].trim()}`,
        });
      }
    }

    return <Recipe>{
      name: meal.strMeal,
      uri: meal.idMeal,
      image: meal.strMealThumb,
      servings: 1,
      preparationTime: 0,
      description: `${meal.strArea} ${meal.strCategory}`,
      videoUrl: meal.strYoutube,
      instructions: meal.strInstructions,
      ingredients: ingredients,
      categories: [{ name: meal.strCategory.toLowerCase() }],
      tags:
        meal.strTags !== null
          ? meal.strTags
              .split(',')
              .filter((tag: string) => tag !== '')
              .map((tag: string) => ({ name: tag.toLowerCase() }))
          : null,
      author: meal.strSource.split('//')[1].split('/')[0],
      recipeUrl: meal.strSource,
      apiName: 'TheMealDB',
    };
  });

  return result.length === 1 ? result[0] : result;
};

export default converter;

// TEST

console.log(
  converter({
    meals: [
      {
        idMeal: '53025',
        strMeal: 'Ful Medames',
        strDrinkAlternate: null,
        strCategory: 'Vegetarian',
        strArea: 'Egyptian',
        strInstructions:
          'As the cooking time varies depending on the quality and age of the beans, it is good to cook them in advance and to reheat them when you are ready to serve. Cook the drained beans in a fresh portion of unsalted water in a large saucepan with the lid on until tender, adding water to keep them covered, and salt when the beans have softened. They take 2–2 1/2 hours of gentle simmering. When the beans are soft, let the liquid reduce. It is usual to take out a ladle or two of the beans and to mash them with some of the cooking liquid, then stir this back into the beans. This is to thicken the sauce.\r\nServe the beans in soup bowls sprinkled with chopped parsley and accompanied by Arab bread.\r\nPass round the dressing ingredients for everyone to help themselves: a bottle of extra-virgin olive oil, the quartered lemons, salt and pepper, a little saucer with the crushed garlic, one with chili-pepper flakes, and one with ground cumin.\r\nThe beans are eaten gently crushed with the fork, so that they absorb the dressing.\r\nOptional Garnishes\r\nPeel hard-boiled eggs—1 per person—to cut up in the bowl with the beans.\r\nTop the beans with a chopped cucumber-and-tomato salad and thinly sliced mild onions or scallions. Otherwise, pass round a good bunch of scallions and quartered tomatoes and cucumbers cut into sticks.\r\nServe with tahina cream sauce (page 65) or salad (page 67), with pickles and sliced onions soaked in vinegar for 30 minutes.\r\nAnother way of serving ful medames is smothered in a garlicky tomato sauce (see page 464).\r\nIn Syria and Lebanon, they eat ful medames with yogurt or feta cheese, olives, and small cucumbers.\r\nVariations\r\nA traditional way of thickening the sauce is to throw a handful of red lentils (1/4 cup) into the water at the start of the cooking.\r\nIn Iraq, large brown beans are used instead of the small Egyptian ones, in a dish called badkila, which is also sold for breakfast in the street.',
        strMealThumb:
          'https://www.themealdb.com/images/media/meals/lvn2d51598732465.jpg',
        strTags: null,
        strYoutube: 'https://www.youtube.com/watch?v=ixpCabILuxw',
        strIngredient1: 'Broad Beans',
        strIngredient2: 'Parsley',
        strIngredient3: 'Olive Oil',
        strIngredient4: 'Lemons',
        strIngredient5: 'Garlic Clove',
        strIngredient6: 'Cumin',
        strIngredient7: '',
        strIngredient8: '',
        strIngredient9: '',
        strIngredient10: '',
        strIngredient11: '',
        strIngredient12: '',
        strIngredient13: '',
        strIngredient14: '',
        strIngredient15: '',
        strIngredient16: '',
        strIngredient17: '',
        strIngredient18: '',
        strIngredient19: '',
        strIngredient20: '',
        strMeasure1: '2 cups ',
        strMeasure2: '1/3 cup',
        strMeasure3: 'Dash',
        strMeasure4: '3',
        strMeasure5: '4',
        strMeasure6: 'Sprinking',
        strMeasure7: ' ',
        strMeasure8: ' ',
        strMeasure9: ' ',
        strMeasure10: ' ',
        strMeasure11: ' ',
        strMeasure12: ' ',
        strMeasure13: ' ',
        strMeasure14: ' ',
        strMeasure15: ' ',
        strMeasure16: ' ',
        strMeasure17: ' ',
        strMeasure18: ' ',
        strMeasure19: ' ',
        strMeasure20: ' ',
        strSource:
          'https://www.epicurious.com/recipes/food/views/ful-medames-352993',
        strImageSource: null,
        strCreativeCommonsConfirmed: null,
        dateModified: null,
      },
    ],
  }),
);
