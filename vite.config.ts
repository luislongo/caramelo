import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react({ jsxRuntime: "classic" })],
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    testMatch: ["**/*.spec.ts?(x)"],
    globals: true,
  },
}));
