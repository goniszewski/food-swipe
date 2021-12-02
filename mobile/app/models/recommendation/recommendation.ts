import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecipeModel } from "../recipe/recipe"

// .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
// .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type RecommendationType = Instance<typeof RecipeModel>
export interface Recommendation extends RecommendationType {}
type RecommendationSnapshotType = SnapshotOut<typeof RecipeModel>
export interface RecommendationSnapshot extends RecommendationSnapshotType {}
export const createRecommendationDefaultModel = () => types.optional(RecipeModel, {})
