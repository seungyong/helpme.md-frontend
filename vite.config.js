import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src")],
        additionalData: (source, filename) => {
          if (!filename) return source;
          const normalized = filename.replace(/\\/g, "/");
          if (
            normalized.endsWith("variable.scss") ||
            normalized.endsWith("mixin.scss") ||
            normalized.endsWith("font.scss")
          )
            return source;
          return `@use "styles/variable.scss" as *; @use "styles/mixin.scss" as *; @use "styles/font.scss" as *;\n${source}`;
        },
      },
    },
  },
});
