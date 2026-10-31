import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Window-only state (localStorage prefs, URL hash, release clock) is read after
      // hydration on purpose so the static HTML matches the server render.
      "react-hooks/set-state-in-effect": "warn",
      // Demos, thumbnails and pixel sprites are served unoptimized (next.config images.unoptimized).
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/**"]),
]);
