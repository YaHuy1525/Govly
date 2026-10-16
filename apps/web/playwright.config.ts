import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. Assumes the three dev servers are already running:
 *   cms (3010), hai-brain (3001), web (3002)
 * reuseExistingServer means Playwright won't try to restart them.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "line",
  timeout: 60000,
  expect: { timeout: 15000 },
  use: {
    baseURL: "http://localhost:3002",
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npx next dev -p 3010",
      url: "http://localhost:3010/api/blog",
      reuseExistingServer: true,
      timeout: 120000,
      cwd: "../cms",
      env: {
        DATABASE_URI:
          process.env.DATABASE_URI || "postgresql://postgres:150205@localhost:5432/holisticai",
        PAYLOAD_SECRET: "dev-secret",
      },
    },
    {
      command: "npx next dev -p 3001",
      url: "http://localhost:3001/f/demo-request-ux7tu",
      reuseExistingServer: true,
      timeout: 120000,
      cwd: "../hai-brain",
    },
    {
      command: "npx next dev -p 3002",
      url: "http://localhost:3002",
      reuseExistingServer: true,
      timeout: 120000,
      env: {
        CMS_URL: "http://localhost:3010",
        NEXT_PUBLIC_HAI_BRAIN_URL: "http://localhost:3001",
        NEXT_PUBLIC_DEMO_FORM_SLUG: "demo-request-ux7tu",
      },
    },
  ],
});
