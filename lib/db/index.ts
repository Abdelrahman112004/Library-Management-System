import type { PgDatabase } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * One schema, two drivers.
 *
 * Without DATABASE_URL we run PGlite - real Postgres compiled to WASM, stored
 * on disk under .pglite. No server and no signup, with the same SQL as
 * production. With DATABASE_URL set (Neon, Vercel Postgres, any Postgres) we
 * use postgres-js instead.
 *
 * Because both are Postgres, moving to a hosted database is a connection-string
 * change and nothing else.
 *
 * The drivers are loaded with dynamic import rather than at the top of the
 * file: PGlite is a devDependency, so on Vercel it is not installed and a
 * static import would fail the build.
 */
// PgDatabase's query-result and session type parameters differ between the
// PGlite and postgres-js drivers. Only the schema parameter matters to callers,
// so the other two are left unconstrained to keep one type for both drivers.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Database = PgDatabase<any, typeof schema, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

type Handle = { db: Database; migrate: () => Promise<void>; close: () => Promise<void> };

declare global {
  // Reused across hot reloads so dev does not open a new PGlite per request.
  var __lmsDb: Promise<Handle> | undefined;
}

const MIGRATIONS = { migrationsFolder: "./drizzle" };

async function create(): Promise<Handle> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const [{ drizzle }, { migrate }, postgres] = await Promise.all([
      import("drizzle-orm/postgres-js"),
      import("drizzle-orm/postgres-js/migrator"),
      import("postgres").then((m) => m.default),
    ]);
    const client = postgres(url, { max: 1 });
    const db = drizzle(client, { schema }) as unknown as Database;
    return {
      db,
      migrate: () => migrate(db as never, MIGRATIONS),
      close: () => client.end(),
    };
  }

  const [{ PGlite }, { drizzle }, { migrate }] = await Promise.all([
    import("@electric-sql/pglite"),
    import("drizzle-orm/pglite"),
    import("drizzle-orm/pglite/migrator"),
  ]);
  // "memory://" gives each test file its own throwaway database.
  const client = new PGlite(process.env.PGLITE_PATH ?? ".pglite");
  const db = drizzle(client, { schema }) as unknown as Database;
  return {
    db,
    migrate: () => migrate(db as never, MIGRATIONS),
    close: () => client.close(),
  };
}

function handle(): Promise<Handle> {
  if (!globalThis.__lmsDb) globalThis.__lmsDb = create();
  return globalThis.__lmsDb;
}

export async function getDb(): Promise<Database> {
  return (await handle()).db;
}

/** Applies the generated migrations to whichever database is configured. */
export async function runMigrations(): Promise<void> {
  await (await handle()).migrate();
}

export async function closeDb(): Promise<void> {
  const existing = globalThis.__lmsDb;
  if (!existing) return;
  globalThis.__lmsDb = undefined;
  await (await existing).close();
}

export { schema };
