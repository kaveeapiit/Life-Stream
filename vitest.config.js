import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    exclude: [
      "**/node_modules/**",
      "**/backend/**",
      "**/tests/e2e/**",
      "**/dist/**",
      "**/coverage/**",
      "**/*.config.{js,ts}",
      "**/playwright.config.js",
      "**/vite.config*.js",
      "**/jest.config.js",
    ],
    coverage: {
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "backend/",
        "tests/e2e/",
        "coverage/",
        "**/*.config.{js,ts}",
        "**/test/**",
      ],
    },
  },
});
