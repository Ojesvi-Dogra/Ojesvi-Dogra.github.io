import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export default defineConfig({
  site: "https://ojesvi-dogra.github.io",
  base: "/demo",
  build: { assets: "static" },
  integrations: [react()],
});
