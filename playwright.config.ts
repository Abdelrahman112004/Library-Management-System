import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * Runs against a production build (next build && next start), not the dev
 * server, so results match what a real user gets.
 *
 * The suite uses its own PGlite database (.pglite-e2e), wiped and migrated by
 * the e2e:prepare step, so it never touches the developer's local data. That
 * step is part of the webServer command rather than globalSetup because
 * Playwright starts the web server first.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npm run e2e:prepare && npm run start -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
    env: { PGLITE_PATH: ".pglite-e2e" },
  },
});
