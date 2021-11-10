import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetRecipesResult, GetRecipeResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import { GetUserResult } from "."

const defaultPagination = {
  page: 1,
  limit: 20,
}

export class UserApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getUser(): Promise<GetUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get("http://localhost:9000/users")

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = response.data

      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
  async getRecommendations(
    page = defaultPagination.page,
    limit = defaultPagination.limit,
  ): Promise<GetRecipesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `http://localhost:9000/users/recommendations/`,
        { page, limit },
      )

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

  async getFavourites(
    page = defaultPagination.page,
    limit = defaultPagination.limit,
  ): Promise<GetRecipesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `http://localhost:9000/users/favourites/`,
        { page, limit },
      )

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

  async addChoice(recipeId: string): Promise<GetUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "http://localhost:9000/user/choices",
        { recipeId },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = response.data

      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async addFavourite(recipeId: string): Promise<GetUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "http://localhost:9000/user/favourites",
        { recipeId },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = response.data

      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async removeRecommendation(recipeId: string): Promise<GetUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.delete(
        `http://localhost:9000/user/recommendations/${recipeId}`,
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const user = response.data

      return { kind: "ok", user }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
