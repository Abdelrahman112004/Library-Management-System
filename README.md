# Library Management System

Manage library items (books, scientific journals, magazines, newspapers),
customers, and borrow/return transactions.

The project has two parts:

- **`/` — the web app.** Next.js + TypeScript, with a REST API and a Postgres
  database. This is the current version.
- **`/library-console` — the original Java console app.** Kept as the reference
  the web version was translated from.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Postgres — PGlite locally, any Postgres in production |
| ORM | Drizzle |
| Validation | Zod, shared between forms and API routes |
| Tests | Vitest (unit), Playwright (end-to-end) |
| Hosting | Vercel |

## Run it locally

Requires Node.js 20 or later.

```bash
npm install
npm run db:migrate    # creates ./.pglite and applies the schema
npm run db:seed       # optional: sample items, customers and loans
npm run dev           # http://localhost:3000
```

No database server or signup is needed. With no `DATABASE_URL` set, the app runs
[PGlite](https://pglite.dev) — real Postgres compiled to WebAssembly, stored in
`./.pglite`. To use a hosted Postgres instead, copy `.env.example` to `.env` and
set `DATABASE_URL`; nothing else changes.

> **Stop the dev server before running `db:migrate` or `db:seed`.** PGlite is a
> single-process database, so a running server holds its own copy and will
> overwrite what the script wrote. This does not apply to a hosted Postgres.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run db:migrate` | Apply migrations to the local or hosted database |
| `npm run db:seed` | Load sample data (clears the tables first) |
| `npm run db:generate` | Regenerate migrations after editing `lib/db/schema.ts` |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint |

## Tests

```bash
npm test          # 34 unit tests: business rules and Zod schemas
npm run test:e2e  # 11 end-to-end tests: full user flows
```

Unit tests run against a real in-memory Postgres, one throwaway database per
test file, and cover the rules that matter: ID generation (including reuse
after a delete), the already-borrowed guard, return handling, and search.

The end-to-end suite builds the app and runs it with `next start`, so results
match production rather than the dev server. It uses its own database
(`.pglite-e2e`), wiped before each run, and selects elements by role and label
so small styling changes do not break it.

## Features

Each item on the original console menu has its own screen.

| Screen | What it does |
|---|---|
| `/items` | View all items; edit or delete any of them |
| `/items/new` | Add a book, scientific journal, magazine or newspaper |
| `/items/[id]/edit` | Update an existing item |
| `/customers` | View customers; edit or delete |
| `/customers/new` | Add a customer |
| `/transactions/borrow` | Borrow an item, with an optional printing or proofreading service |
| `/transactions/return` | Return an item by transaction ID |
| `/transactions/outstanding` | List a customer's items not yet returned |
| `/authors` | List all publications by an author's last name |

## API

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/items` | All items; `?title=` or `?authorLastName=` to search |
| `POST` | `/api/items` | Create an item |
| `GET PUT DELETE` | `/api/items/:id` | Read, update, delete |
| `GET` | `/api/customers` | All customers |
| `POST` | `/api/customers` | Create a customer |
| `GET PUT DELETE` | `/api/customers/:id` | Read, update, delete |
| `GET` | `/api/transactions` | All; `?outstandingFor=` for open loans |
| `POST` | `/api/transactions/borrow` | Borrow |
| `POST` | `/api/transactions/return` | Return |

## Where the web app differs from the Java

The rules are the same — same entities, same validations, same ID sequences
(items from `1`, customers from `"110"`, transactions from `"1000"`, each
reusing the first free number). Three differences are worth knowing:

- **Deleting an item or customer with transactions is refused** (HTTP 409). The
  Java removed it from the list and left the transaction pointing at nothing.
  The database enforces the reference instead.
- **Authors are shared.** The Java compared authors by object identity, which
  never matched, so every item got its own copy. Here two items by the same
  author with the same date of birth share one author row.
- **The borrow screen hides items already on loan**, rather than letting you
  pick one and then rejecting it. The API still enforces the rule either way.

## Deploying to Vercel

1. Create a Postgres database (Neon or Vercel Postgres).
2. Import the repository into Vercel.
3. Add `DATABASE_URL` under **Settings → Environment Variables**.
4. Apply the schema once: `DATABASE_URL="..." npm run db:migrate`.

No `vercel.json` is needed — Next.js is detected automatically, and the API
routes deploy as serverless functions alongside the pages.

## Project layout

```
app/          routing only: pages, layouts, API routes
lib/          business logic, grouped by domain
  db/         Drizzle schema and connection
  items/      Zod schema + item rules
  customers/  Zod schema + customer rules
  transactions/  borrow, return, outstanding
components/   shared UI pieces
drizzle/      generated migrations
tests/        unit/ (Vitest) and e2e/ (Playwright)
library-console/  the original Java app
```

---

# The original Java console app

Lives in `library-console/`, kept as the reference for the rewrite.

## Run it

**Eclipse (recommended)** — the folder is a ready-to-import Eclipse project, and
Eclipse supplies its own JDK.

1. **File → Import… → General → Existing Projects into Workspace**
2. Set the root directory to `library-console`, tick it, and click **Finish**
3. Open `src/library/Application.java` and press **Ctrl+F11**

**Command line** — needs a JDK on your `PATH` (check with `javac -version`):

```bash
cd library-console/src
javac library/*.java -d ../bin
java -cp ../bin library.Application
```

Data is saved to `items.txt`, `Customers.txt` and `transactions.txt` in the
working directory via Java object serialization.

## Fixes applied to the console app

The rewrite surfaced a number of defects in the original. They were fixed in
both versions.

| Fix | Was |
|---|---|
| `Item.title` made per-instance | `static`, so every item shared one title |
| `Service implements Serializable` | Borrowing with a service failed to save |
| `items.txt` overwritten, not appended | Appending corrupted the file and duplicated items |
| `updateDueDays` sets due days | Set the price instead |
| `deleteItemByTitle` uses an iterator | Removed mid-loop — `ConcurrentModificationException` |
| Author search filters magazines/newspapers | Listed them all regardless of the name searched |
| `Scanner` uses `Locale.ROOT` | Decimal prices like `10.5` threw `InputMismatchException` |
| One shared `Scanner` | 25 separate scanners stole each other's input |
| Newline consumed after menu choice | Service prompts read the wrong lines |
| `instanceof` guards before casting | Wrong-type title threw `ClassCastException` |
| Update sub-menus renumbered | Printed numbers didn't match the handled cases |
| `returnTransaction` simplified | Dead branch asked "which one?" for a single transaction |
