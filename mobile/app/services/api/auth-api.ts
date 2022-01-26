import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GeneralApiProblem, getGeneralApiProblem } from "./api-problem"
import { GetTokensResult } from "."

const API_PAGE_SIZE = 50

export interface Credentials {
  login: string
  password: string
}

export class AuthApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async login({ login, password }): Promise<GetTokensResult> {
    try {
      const payload: Credentials = { login, password }
      // make the api call

      const response: ApiResponse<any> = await this.api.apisauce.post(
        "http://localhost:9000/auth/login",
        payload,
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const tokens = response.data

      return { kind: "ok", tokens }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
