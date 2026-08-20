/**
 * Wipes and re-migrates the end-to-end database.
 *
 * This runs as part of the Playwright webServer command rather than in
 * globalSetup, because Playwright starts the web server before globalSetup -
 * the server would otherwise serve its first request against a database with
 * no tables.
 */
import { rm } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

const path = process.env.PGLITE_PATH ?? ".pglite-e2e";

async function main() {
  await rm(path, { recursive: true, force: true });

  const client = new PGlite(path);
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.close();

  console.log(`E2E database ready at ${path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
