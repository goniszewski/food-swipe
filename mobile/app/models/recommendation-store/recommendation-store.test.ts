import { RecipeStoreModel } from "./recipe-store"

test("can be created", () => {
  const instance = RecipeStoreModel.create({})

  expect(instance).toBeTruthy()
})
