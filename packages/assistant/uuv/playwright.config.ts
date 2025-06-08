import { defineConfig, devices } from "@playwright/test";
import { buildConfig } from "@uuv/playwright";

export default defineConfig({
  testDir: buildConfig(
      ["e2e/*.feature"],
      [
        "../../../node_modules/@uuv/playwright/dist/cucumber/preprocessor/index.js",
        "../../../node_modules/@uuv/playwright/dist/cucumber/step_definitions/playwright/**/*.js"
      ]
  ),
  testMatch: ["**/*.spec.ts", "**/*.{ts,js}"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "uuv/reports/html/playwright" }]],
  use: {
    baseURL: "http://127.0.0.1:3200",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: "edge",
      use: { ...devices["Desktop Edge"], channel: "msedge" },
    },
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: "npm run react:start",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: !process.env.CI
  }
});
