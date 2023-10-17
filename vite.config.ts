import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    testMatch: ["**/*.spec.ts?(x)"],
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "json", "json-summary"],
      exclude: [],
      lines: 80,
      branches: 80,
      functions: 80,
      statements: 80,
    },
  },
}));
