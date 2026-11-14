import { defineConfig, devices } from "@playwright/test";

// E2E runs against the production build (`npm run build` first), never the dev
// server: what this suite guards against (a utility missing from the built CSS,
// an episode still under embargo) only exists there. E2E_PORT lets two suites
// run side by side.
const PORT = Number(process.env.E2E_PORT ?? 3238);

export default defineConfig({
  testDir: "./e2e",
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    // Each test sets its own viewport (the suite sweeps 280-1920px), so a project
    // only picks the engine. WebKit stands in for Safari on iPhone and iPad.
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
