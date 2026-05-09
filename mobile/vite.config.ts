import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "src/app"),
      data: path.resolve(__dirname, "src/data"),
      domain: path.resolve(__dirname, "src/domain"),
      infrastructure: path.resolve(__dirname, "src/infrastructure"),
      presentation: path.resolve(__dirname, "src/presentation"),
      theme: path.resolve(__dirname, "src/theme"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8100,
  },
});
