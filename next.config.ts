import type { NextConfig } from "next";

// Cache Components is off on purpose: every page renders on request, which is the
// simplest model for a 25-hour build. See CLAUDE.md before turning it on.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
