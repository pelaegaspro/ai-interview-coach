import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { MIN_OVERLAY_OPACITY, MAX_OVERLAY_OPACITY } = require("./utils/constants.js");

export default defineConfig({
  root: path.resolve(process.cwd(), "frontend"),
  plugins: [react()],
  define: {
    __OVERLAY_RANGE__: JSON.stringify({
      min: MIN_OVERLAY_OPACITY,
      max: MAX_OVERLAY_OPACITY
    })
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "frontend/src")
    }
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist"),
    emptyOutDir: true
  }
});
