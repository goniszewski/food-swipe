import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as SecureStore from "expo-secure-store"

import { withEnvironment } from "../extensions/with-environment"
import { AuthModel, AuthSnapshot } from "../auth/auth"
import { AuthApi } from "../../services/api/auth-api"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    tokens: types.maybe(AuthModel),
  })
  .extend(withEnvironment)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    saveTokens: (authSnapshot: AuthSnapshot) => {
      self.tokens = { ...authSnapshot }
    },
  }))
  .actions((self) => ({
    login: async ({ login, password }) => {
      const authApi = new AuthApi(self.environment.api)
      const result = await authApi.login({ login, password })

      if (result.kind === "ok") {
        await SecureStore.setItemAsync("tokens", JSON.stringify(result.tokens))
        self.saveTokens(result.tokens)

        return "ok"
      } else {
        __DEV__ && console.tron.log(result.kind)
        return "error"
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

type AuthStoreType = Instance<typeof AuthStoreModel>
export interface AuthStore extends AuthStoreType {}
type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>
export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
