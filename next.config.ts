import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a WASM build of Postgres and resolves it relative to its own
  // files. Bundling it breaks that lookup ("path argument must be of type
  // string ... received an instance of URL"), so it is loaded from node_modules
  // at runtime instead. postgres-js is listed for the same reason.
  serverExternalPackages: ["@electric-sql/pglite", "postgres"],
};

export default nextConfig;
