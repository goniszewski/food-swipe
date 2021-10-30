import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetRecipesResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

const API_PAGE_SIZE = 50

export class RecipeApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getRecipes(): Promise<GetRecipesResult> {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.api.apisauce.get(
        "http://localhost:9000/recipes",
        { amount: API_PAGE_SIZE },
      )
      console.log({ response })

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const recipes = response.data

      return { kind: "ok", recipes }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
