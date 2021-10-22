import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const RecipeModel = types.model("Recipe").props({
  id: types.identifier,
  name: types.string,
  uri: types.string,
  image: types.maybe(types.string),
  servings: types.number,
  caloriesPerServing: types.maybe(types.number),
  preparationTime: types.number,
  description: types.string,
  instructions: types.maybe(types.string),
  videoUrl: types.maybe(types.string),
  ingredients: types.array(types.string),
  categories: types.array(types.string),
  tags: types.array(types.string),
  isVegan: types.maybe(types.boolean),
  isCheap: types.maybe(types.boolean),
  isVegetarian: types.maybe(types.boolean),
  author: types.string,
  recipeUrl: types.string,
  apiName: types.maybe(types.string),
  apiAttributionHTML: types.maybe(types.string),
})
// .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
// .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type RecipeType = Instance<typeof RecipeModel>
export interface Recipe extends RecipeType {}
type RecipeSnapshotType = SnapshotOut<typeof RecipeModel>
export interface RecipeSnapshot extends RecipeSnapshotType {}
export const createRecipeDefaultModel = () => types.optional(RecipeModel, {})
