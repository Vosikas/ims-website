import type { NextConfig } from "next";

// The Panhellenic exams login (app/panhellenicexams) talks to its own backend (the BACKEND repo,
// Quarkus). The site proxies /panhellenicexams/api to it, so the browser sees one origin and the
// session cookie works without CORS. Without PANHELLENIC_API_URL a production build has no API,
// and the login only works in mock mode.
const panhellenicApi =
  process.env.PANHELLENIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8080" : undefined);

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles, so the catch-all app/panhellenicexams/[...missing] doesn't take these paths.
      beforeFiles: panhellenicApi
        ? [{ source: "/panhellenicexams/api/:path*", destination: `${panhellenicApi}/api/:path*` }]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
