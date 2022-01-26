import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthModel = types.model("Auth").props({
  token: types.string,
  tokenExp: types.number,
  refreshToken: types.string,
})
// .views((self) => ({}))
// .actions((self) => ({}))

type AuthType = Instance<typeof AuthModel>
export interface Auth extends AuthType {}
type AuthSnapshotType = SnapshotOut<typeof AuthModel>
export interface AuthSnapshot extends AuthSnapshotType {}
export const createAuthDefaultModel = () => types.optional(AuthModel, {})
