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
          "bearer eyJraWQiOiJEbHcweklVeVF4SlArMWRsT1Y5OGVUNVozb2didzBORkJIMDF3N1wvZWlkQT0iLCJhbGciOiJSUzI1NiJ9.eyJvcmlnaW5fanRpIjoiZDY2ODZmMWQtYmE2NS00Y2UwLTg0ZjEtMzg1NTE2NjM5ZTU1Iiwic3ViIjoiN2EyMzJjYTEtMTNkYS00YjJlLTlhMzYtYjFjZGVmNzI2ZWJlIiwiYXVkIjoiN2s1dWpvdDk3bjV1bG5hOTYwNHU3OHNlZjUiLCJldmVudF9pZCI6ImI0NmI0OWJiLTc2MWQtNGM1MS1hZGRmLTg0OGRkOTJiODViMSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM2NjQxODI4LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl90THJLMm5YSUgiLCJjb2duaXRvOnVzZXJuYW1lIjoicm9iZXJ0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoicm9iZXJ0IiwiZXhwIjoxNjM2NjQ1NDI4LCJpYXQiOjE2MzY2NDE4MjgsImp0aSI6IjYyNDE1OTQyLWU4ODMtNGQyNi1hODZhLTQ5MTRjOTM5ZGY3NSJ9.o886Abf8Y-tBrTxnw6YKChEfAoAD159eh2zKmWxk5XMFNq_ZPavL5se8fS2CICJJ4AyLtvzBm5MaNpBpYiHu0CPydKXY-TNFHVjGWGzg04q2VYRgj9xIQKgPaVTK0sS9Vz-Gt8HOMTNDid0n5iedJL8ZZPPVxjKfEyNrCjnTQLU-edX2y2ZX04tqSRFrgPjadpO3f6RoOSCWUb4IFH7wnoryzvPuLLNex0pWiadVPl5lKKQgHyWv3PqBixupQaUwzBv_kXurFmSbOcMI_7Sl6y_vuT5RjyKOkuUy_uTOFoqt0teYi8sgOanOL2-Sr1pg2veo1zHfN1IFp89my_joYQ",
      },
    })
  }
}
