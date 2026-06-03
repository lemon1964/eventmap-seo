// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
    url: `http://127.0.0.1:${PORT}`,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: chromiumExecutablePath
          ? {
              executablePath: chromiumExecutablePath,
              args: [
                "--no-sandbox",
                "--proxy-server=direct://",
                "--proxy-bypass-list=*",
                "--disable-features=BlockInsecurePrivateNetworkRequests",
              ],
            }
          : undefined,
      },
    },
  ],
});
