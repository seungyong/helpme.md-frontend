import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src")],
        additionalData: (source, filename) => {
          if (!filename) return source
          const normalized = filename.replace(/\\/g, "/")
          if (
            normalized.endsWith("variable.scss") ||
            normalized.endsWith("mixin.scss")
          )
            return source
          return `@use "styles/variable.scss" as *; @use "styles/mixin.scss" as *;\n${source}`
        },
      },
    },
  },
});
