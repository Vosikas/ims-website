import type { NextConfig } from "next";

// The Panhellenic exams login is its own app (EXAMS_PANEL: a frontend and a backend). The site
// serves both under /panhellenicexams by proxying, so visitors never leave the site's address.
// Without these variables a production build simply has no /panhellenicexams.
const isDev = process.env.NODE_ENV === "development";
const panhellenicFrontend =
  process.env.PANHELLENIC_FRONTEND_URL ?? (isDev ? "http://localhost:5173" : undefined);
const panhellenicApi =
  process.env.PANHELLENIC_API_URL ?? (isDev ? "http://localhost:8080" : undefined);

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles, so app/[lang] doesn't take "panhellenicexams" for a language.
      beforeFiles: [
        // The API first: the frontend rule below would also match these paths.
        ...(panhellenicApi
          ? [
              {
                source: "/panhellenicexams/api/:path*",
                destination: `${panhellenicApi}/api/:path*`,
              },
            ]
          : []),
        ...(panhellenicFrontend
          ? [
              {
                source: "/panhellenicexams",
                destination: `${panhellenicFrontend}/panhellenicexams/`,
              },
              {
                source: "/panhellenicexams/:path*",
                destination: `${panhellenicFrontend}/panhellenicexams/:path*`,
              },
            ]
          : []),
      ],
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
