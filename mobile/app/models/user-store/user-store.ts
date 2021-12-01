import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserModel, UserSnapshot } from "../user/user"
import { withEnvironment } from "../extensions/with-environment"
import { UserApi } from "../../services/api/user-api"

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    user: types.maybe(UserModel),
  })
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveUser: (userSnapshot: UserSnapshot) => {
      self.user = { ...userSnapshot }
    },
    saveRecommendations: (fetchedRecommendedRecipes) => {
      self.user = { ...self.user, fetchedRecommendedRecipes }
    },
    saveChoices: (choicesHistory) => {
      self.user = { ...self.user, choicesHistory }
    },
    addChoice: (choice) => {
      self.user = self.user.choicesHistory.push(choice)
    },
  }))
  .actions((self) => ({
    getUser: async () => {
      const recipesApi = new UserApi(self.environment.api)
      const result = await recipesApi.getUser()

      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },

    getRecommendations: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getRecommendations()

      if (result.kind === "ok") {
        self.saveRecommendations(result.recipes)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },

    rejectRecipe: async (recipeId: string) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.removeRecommendation(recipeId)

      if (result.kind === "ok") {
        self.saveRecommendations(self.user.recommendedRecipes.filter((r) => r !== recipeId))
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },

    approveRecipe: async (recipeId: string) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.addChoice(recipeId)

      if (result.kind === "ok") {
        self.saveUser(result.user)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
