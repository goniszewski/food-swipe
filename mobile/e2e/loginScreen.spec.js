const { reloadApp } = require("./reload")

describe("LoginScreen", () => {
  beforeEach(async () => {
    await reloadApp()
  })

  it("welcome screen should be displayed", async () => {
    await expect(element(by.id("WelcomeScreen"))).toBeVisible()
  })

  it("should go to next screen after tap", async () => {
    await element(by.id("welcomeScreenContinueButton")).tap()
    await expect(element(by.id("LoginScreen"))).toBeVisible()
  })
})
