import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const Category = types.model("Category").props({
  id: types.identifier,
  name: types.string,
})

export const Item = types.model("Item").props({
  id: types.identifier,
  name: types.string,
  isVegan: types.maybe(types.boolean),
  isVegetarian: types.maybe(types.boolean),
  isAllergen: types.maybe(types.boolean),
  isGlutenFree: types.maybe(types.boolean),
})

export const Ingredient = types.model("Ingredient").props({
  id: types.identifier,
  name: types.string,
  image: types.maybeNull(types.string),
  item: Item,
  amount: types.string,
  unit: types.maybeNull(types.string),
  notes: types.maybe(types.string),
  isMain: types.maybe(types.boolean),
})

export const RecipeModel = types.model("Recipe").props({
  id: types.identifier,
  name: types.string,
  uri: types.string,
  image: types.maybe(types.string),
  servings: types.number,
  caloriesPerServing: types.maybe(types.number),
  preparationTime: types.number,
  description: types.string,
  instructions: types.maybe(types.union(types.string, types.null)),
  videoUrl: types.maybe(types.union(types.string, types.null)),
  ingredients: types.array(Ingredient),
  categories: types.maybe(types.array(Category)),
  tags: types.maybeNull(types.array(types.string)),
  isVegan: types.maybe(types.boolean),
  isCheap: types.maybe(types.boolean),
  isVegetarian: types.maybe(types.boolean),
  author: types.string,
  recipeUrl: types.string,
  apiName: types.maybe(types.string),
  apiAttributionHTML: types.maybe(types.string),
  validated: types.maybe(types.boolean),
})
// .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
// .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type RecipeType = Instance<typeof RecipeModel>
export interface Recipe extends RecipeType {}
type RecipeSnapshotType = SnapshotOut<typeof RecipeModel>
export interface RecipeSnapshot extends RecipeSnapshotType {}
export const createRecipeDefaultModel = () => types.optional(RecipeModel, {})
