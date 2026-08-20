import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    // Each test file gets its own throwaway in-memory Postgres, so tests never
    // share state and never touch the developer's .pglite database.
    env: { PGLITE_PATH: "memory://" },
    // PGlite boots a WASM Postgres per file; the default 5s is not enough.
    testTimeout: 30_000,
    hookTimeout: 60_000,
  },
});
