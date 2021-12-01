import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecipeModel } from "../recipe/recipe"
// import { RecipeModel } from "../recipe/recipe"

export const UserModel = types.model("User").props({
  id: types.identifier,
  login: types.string,
  name: types.string,
  // favourites: types.array(RecipeModel),
  // choicesHistory: types.array(RecipeModel),
  // recommendedRecipes: types.array(RecipeModel),
  favourites: types.array(types.string),
  choicesHistory: types.array(types.string),
  recommendedRecipes: types.array(types.string),
  fetchedRecommendedRecipes: types.maybe(types.array(RecipeModel)),
  defaultVegan: types.maybe(types.boolean),
  defaultVegetarian: types.maybe(types.boolean),
  defaultGlutenFree: types.maybe(types.boolean),
  defaultNotRaw: types.maybe(types.boolean),
  allergyTo: types.array(types.string),
  debug: types.maybe(types.boolean),
})
// .views((self) => ({}))
// .actions((self) => ({}))

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
