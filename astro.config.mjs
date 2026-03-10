// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  base: "/tsl-easings",
  srcDir: "./src/demo",
  outDir: "./demo",
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Roboto Condensed",
        cssVariable: "--font-sans",
      },
    ],
  },
});
