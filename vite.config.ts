import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
    testMatch: ["**/*.spec.ts?(x)"],
    globals: true,
  },
}));
