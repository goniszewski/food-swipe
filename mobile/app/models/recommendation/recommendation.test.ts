import { RecipeModel } from "./recipe"

test("can be created", () => {
  const instance = RecipeModel.create({})

  expect(instance).toBeTruthy()
})
