import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    // Ensure environment variables are available in production
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    open: false,
    host: false,
  },
  logLevel: "warn", // Only show warnings and errors
  clearScreen: false, // Don't clear the screen on rebuild
});
