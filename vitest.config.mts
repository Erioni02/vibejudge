import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/helpers/empty.ts", import.meta.url))
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // A shared external test database can't be truncated by several files at once.
    fileParallelism: !process.env.TEST_DATABASE_URL,
    testTimeout: 30_000,
    hookTimeout: 60_000
  }
});
