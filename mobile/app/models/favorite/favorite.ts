import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecipeModel } from "../recipe/recipe"

// .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
// .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type FavoriteType = Instance<typeof RecipeModel>
export interface Favorite extends FavoriteType {}
type FavoriteSnapshotType = SnapshotOut<typeof RecipeModel>
export interface FavoriteSnapshot extends FavoriteSnapshotType {}
export const createFavoriteDefaultModel = () => types.optional(RecipeModel, {})
