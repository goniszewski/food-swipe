import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecipeModel, RecipeSnapshot } from "../recipe/recipe"
import { FavoriteSnapshot } from "../favorite/favorite"
import { RecipeApi } from "../../services/api/recipe-api"
import { withEnvironment } from "../extensions/with-environment"
import { UserApi } from "../../services/api/user-api"

export const FavoriteStoreModel = types
  .model("FavoriteStore")
  .props({
    favorites: types.optional(types.array(RecipeModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveFavorites: (favoriteSnapshots: FavoriteSnapshot[]) => {
      self.favorites.replace(favoriteSnapshots)
    },
  }))
  .actions((self) => ({
    getFavorites: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getFavorites()

      if (result.kind === "ok") {
        self.saveFavorites(result.recipes)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type FavoriteStoreType = Instance<typeof FavoriteStoreModel>
export interface FavoriteStore extends FavoriteStoreType {}
type FavoriteStoreSnapshotType = SnapshotOut<typeof FavoriteStoreModel>
export interface FavoriteStoreSnapshot extends FavoriteStoreSnapshotType {}
export const createFavoriteStoreDefaultModel = () => types.optional(FavoriteStoreModel, {})
