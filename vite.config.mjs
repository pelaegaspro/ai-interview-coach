import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  root: path.resolve(process.cwd(), "frontend"),
  plugins: [react()],
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
