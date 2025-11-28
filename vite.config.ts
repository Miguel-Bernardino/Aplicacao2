import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Use VITE_PROXY_TARGET if provided to proxy /api in dev
const proxyTarget = process.env.VITE_PROXY_TARGET || undefined;

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: proxyTarget
    ? {
        proxy: {
          "/api": {
            target: proxyTarget,
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined,
});
