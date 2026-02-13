import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import process from "node:process";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const requiredEnvVars = ["VITE_API_URL", "VITE_GITHUB_INSTALLATION_URL"];
  for (const envVar of requiredEnvVars) {
    if (!env[envVar]?.trim()) {
      throw new Error(
        `[Vite] Missing required environment variable: ${envVar}. ` +
          `Set it in .env or .env.production and run build again.`
      );
    }
  }

  return {
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
  };
});
