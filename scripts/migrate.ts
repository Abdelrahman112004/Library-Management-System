/**
 * Applies the generated migrations.
 *
 * With no DATABASE_URL this targets the local PGlite database (.pglite), so a
 * fresh clone needs no database server. With DATABASE_URL set it targets that
 * Postgres instead - the same migrations either way.
 */
import "dotenv/config";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const MIGRATIONS = { migrationsFolder: "./drizzle" };

async function main() {
  const url = process.env.DATABASE_URL;

  if (url) {
    const client = postgres(url, { max: 1 });
    await migratePostgres(drizzlePostgres(client), MIGRATIONS);
    await client.end();
    console.log("Migrations applied to DATABASE_URL");
    return;
  }

  const path = process.env.PGLITE_PATH ?? ".pglite";
  const client = new PGlite(path);
  await migratePglite(drizzlePglite(client), MIGRATIONS);
  await client.close();
  console.log(`Migrations applied to PGlite at ${path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
