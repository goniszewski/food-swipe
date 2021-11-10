import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as SecureStore from "expo-secure-store"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */

  async getToken() {
    const token = await SecureStore.getItemAsync("token")
    return token
  }

  async setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        // bearer: await this.getToken(),
        Authorization:
          "bearer eyJraWQiOiJEbHcweklVeVF4SlArMWRsT1Y5OGVUNVozb2didzBORkJIMDF3N1wvZWlkQT0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiOWNiYjRmNDktNWI5Yy00NDg4LThjYzItMzQ2NzBlYjVhNThmIiwic3ViIjoiN2EyMzJjYTEtMTNkYS00YjJlLTlhMzYtYjFjZGVmNzI2ZWJlIiwiYXVkIjoiN2s1dWpvdDk3bjV1bG5hOTYwNHU3OHNlZjUiLCJldmVudF9pZCI6IjAyZGY5Y2ZmLTRlOWMtNDlhNS1hOGEzLTJiODZjZmE0NTQ3NiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2NTIzMzUyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl90THJLMm5YSUgiLCJjb2duaXRvOnVzZXJuYW1lIjoicm9iZXJ0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicm9iZXJ0IiwiZXhwIjoxNjM2NTI2OTUyLCJpYXQiOjE2MzY1MjMzNTIsImp0aSI6ImFhOWEwMzc1LWFhNzktNGI3ZS05MjQ4LTIwNDMyYWNiNGU3OCJ9.Y2gHRHteRaEKAWDTYegQPLzLk-Sa3i3v1-jQmKRjotajnra2ebo6X1ncocv4LKlC1JneVzLebv9uULlN2S36oC_1iJkxMqtxwSF8WS7jcZhGHvW7MOGE43GLnCC6z328-jd0410R4Qfdg-VJ1TP-fzC9Al9Q23-OwvXwj55rSXpGj4Eh5-le3gH6PjlltzZRGfeQ9KEkEaGwPW36BBkuHei5WMJbtd7QHaztb4DhB2QPzm50WZ4sBaXucynqkwNYgGPlBkHW7SkAwSvifzyAdX7XhTjuuRIVMk0GqByISxOYyZXTwj5bcwUvfPp2U03LNEvQDqUMhTVcCvekif6E6w",
      },
    })
  }
}
