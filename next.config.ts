import type { NextConfig } from "next";

// The Panhellenic exams platform is a separate WordPress site. The site always links to
// /panhellenicexams, so when WordPress moves only this address has to change.
const eclassUrl = process.env.ECLASS_URL ?? "http://ims-eclass.local";

const nextConfig: NextConfig = {
  async redirects() {
    // Temporary, so browsers don't remember an address that will still change.
    return [{ source: "/panhellenicexams", destination: eclassUrl, permanent: false }];
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
