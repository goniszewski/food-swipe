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
    updateRecommendations: (recommendedRecipes) => {
      self.user = { ...self.user, recommendedRecipes }
    },
    saveChoices: (choicesHistory) => {
      self.user = { ...self.user, choicesHistory }
    },
    addChoice: (choice) => {
      self.user = self.user.choicesHistory.push(choice)
    },
    savePreferences: (preferences) => {
      self.user = { ...self.user, ...preferences }
    },
  }))
  .actions((self) => ({
    getUser: async () => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.getUser()
      const favorites = await userApi.getFavorites()

      if (result.kind === "ok") {
        self.saveUser({ ...result.user, favorites })
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
        self.updateRecommendations(self.user.recommendedRecipes.filter((r) => r !== recipeId))
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },

    updatePreferences: async (preferences: object) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.updatePreferences(preferences)

      if (result.kind === "ok") {
        self.saveUser(result.user)
        return true
      } else {
        __DEV__ && console.tron.log(result.kind)
        return false
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

    favoriteRecipe: async (recipeId: string) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.addFavorite(recipeId)

      if (result.kind === "ok") {
        self.saveUser({ ...self.user, favorites: result.favorites })
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
    removeFavoriteRecipe: async (recipeId: string) => {
      const userApi = new UserApi(self.environment.api)
      const result = await userApi.removeFavorite(recipeId)
      console.log(result)

      if (result.kind === "ok") {
        self.saveUser({ ...self.user, favorites: result.favorites })
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
