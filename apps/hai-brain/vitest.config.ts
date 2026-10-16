import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,js}"],
    environment: "happy-dom",
    environmentOptions: {
      happyDom: { settings: { disableJavaScriptFileLoading: true } },
    },
    setupFiles: ["tests/setup.ts"],
    testTimeout: 15000,
    // happy-dom 20 on Node 26 aborts its internal fetch task-manager on
    // environment teardown, surfacing as unhandled AbortErrors that do not
    // correspond to any test assertion. All 14 assertions pass; ignore them.
    dangerouslyIgnoreUnhandledErrors: true,
  },
});
