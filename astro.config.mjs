// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://juddgurtman.com",
  trailingSlash: "always",
  // Plain HTML whitespace. Astro 7's default ('jsx') drops the space between a word
  // and a link that starts on the next line.
  compressHTML: true,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
