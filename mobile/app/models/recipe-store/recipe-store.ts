import { Instance, SnapshotOut, types, cast } from "mobx-state-tree"
import { RecipeModel, RecipeSnapshot } from "../recipe/recipe"
import { RecipeApi } from "../../services/api/recipe-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing Rick and Morty characters
 */
export const RecipeStoreModel = types
  .model("RecipeStore")
  .props({
    recipes: types.optional(types.array(RecipeModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveRecipes: (recipeSnapshots: RecipeSnapshot[]) => {
      self.recipes.replace(recipeSnapshots)
      // self.recipes = cast(recipeSnapshots)
    },
  }))
  .actions((self) => ({
    getRecipes: async () => {
      const recipesApi = new RecipeApi(self.environment.api)
      const result = await recipesApi.getRecipes()

      if (result.kind === "ok") {
        self.saveRecipes(result.recipes)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type RecipeStoreType = Instance<typeof RecipeStoreModel>
export interface RecipeStore extends RecipeStoreType {}
type RecipeStoreSnapshotType = SnapshotOut<typeof RecipeStoreModel>
export interface RecipeStoreSnapshot extends RecipeStoreSnapshotType {}
export const createRecipeStoreDefaultModel = () => types.optional(RecipeStoreModel, {})
