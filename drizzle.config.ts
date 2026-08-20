import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migrations are generated from the schema; DATABASE_URL is only needed for
  // pushing to a hosted database. Local development applies them to PGlite via
  // scripts/migrate.ts.
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/placeholder",
  },
});
