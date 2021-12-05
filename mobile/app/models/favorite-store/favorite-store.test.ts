import { FavoriteStoreModel } from "./favorite-store"

test("can be created", () => {
  const instance = FavoriteStoreModel.create({})

  expect(instance).toBeTruthy()
})
