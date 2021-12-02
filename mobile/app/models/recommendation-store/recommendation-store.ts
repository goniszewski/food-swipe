import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecipeModel, RecipeSnapshot } from "../recipe/recipe"
import { RecommendationSnapshot } from "../recommendation/recommendation"
import { RecipeApi } from "../../services/api/recipe-api"
import { withEnvironment } from "../extensions/with-environment"
import { UserApi } from "../../services/api/user-api"

export const RecommendationStoreModel = types
  .model("RecommendationStore")
  .props({
    recommendations: types.optional(types.array(RecipeModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveRecommendations: (recommendationSnapshots: RecommendationSnapshot[]) => {
      self.recommendations.replace(recommendationSnapshots)
    },
  }))
  .actions((self) => ({
    getRecommendations: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getRecommendations()

      if (result.kind === "ok") {
        self.saveRecommendations(result.recipes)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type RecommendationStoreType = Instance<typeof RecommendationStoreModel>
export interface RecommendationStore extends RecommendationStoreType {}
type RecommendationStoreSnapshotType = SnapshotOut<typeof RecommendationStoreModel>
export interface RecommendationStoreSnapshot extends RecommendationStoreSnapshotType {}
export const createRecommendationStoreDefaultModel = () =>
  types.optional(RecommendationStoreModel, {})
