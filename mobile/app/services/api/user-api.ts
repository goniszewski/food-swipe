import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetRecipesResult, GetRecipeResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"
import { GetUserResult } from "."

export class AddUserRecipeInteraction {
  recipeId: string
  timestamp: Date
  source: string
}

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
}

const SOURCE = "mobile"

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
    page = DEFAULT_PAGINATION.page,
    limit = DEFAULT_PAGINATION.limit,
  ): Promise<GetRecipesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `http://localhost:9000/user/recommendations/`,
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

  async getFavorites(
    page = DEFAULT_PAGINATION.page,
    limit = DEFAULT_PAGINATION.limit,
  ): Promise<GetRecipesResult> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.get(
        `http://localhost:9000/user/favorites/`,
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

  async updatePreferences(preferences: object): Promise<any> {
    const payload: any = {
      ...preferences,
    }

    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "http://localhost:9000/user/preferences",
        payload,
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

  async addChoice(recipeId: string): Promise<any> {
    const payload: AddUserRecipeInteraction = {
      recipeId,
      timestamp: new Date(),
      source: SOURCE,
    }

    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "http://localhost:9000/user/choices",
        payload,
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

  async addFavorite(recipeId: string): Promise<any> {
    const payload: AddUserRecipeInteraction = {
      recipeId,
      timestamp: new Date(),
      source: SOURCE,
    }

    try {
      const response: ApiResponse<any> = await this.api.apisauce.patch(
        "http://localhost:9000/user/favorites",
        payload,
      )

      console.log(response)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const favorites = response.data

      return { kind: "ok", favorites }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async removeRecommendation(recipeId: string): Promise<any> {
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

  async removeFavorite(recipeId: string): Promise<any> {
    try {
      const response: ApiResponse<any> = await this.api.apisauce.delete(
        `http://localhost:9000/user/favorites/${recipeId}`,
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const favorites = response.data

      return { kind: "ok", favorites }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
