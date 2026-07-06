import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// GitHub Pages serves this app from https://<user>.github.io/task-manager/,
// so the production build needs that subpath as its base. Dev keeps "/" so
// `npm run dev` still opens at the localhost root instead of under the subpath.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/task-manager/" : "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    open: true,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
}));