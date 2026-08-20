/**
 * Fills the database with sample data so the app has something to show.
 *
 * Safe to re-run: it clears the four tables first. Runs against whatever
 * database is configured - local PGlite by default, or DATABASE_URL if set.
 *
 *   npm run db:seed
 */
import "dotenv/config";
import { getDb, closeDb } from "@/lib/db";
import { authors, customers, items, transactions } from "@/lib/db/schema";
import { createItem } from "@/lib/items/service";
import { createCustomer } from "@/lib/customers/service";
import { borrow, returnItem } from "@/lib/transactions/service";
import type { ItemInput } from "@/lib/items/schema";
import type { CustomerInput } from "@/lib/customers/schema";

const ITEMS: ItemInput[] = [
  {
    kind: "book",
    title: "The Pragmatic Programmer",
    author: { firstName: "Andrew", lastName: "Hunt", dateOfBirth: "1964-01-01" },
    price: 38.5,
    pages: 352,
    dueDays: 14,
    publishingDate: "1999-10-20",
    isbn: "978-0201616224",
    genre: "Software",
    description: "From journeyman to master.",
  },
  {
    kind: "book",
    title: "Clean Code",
    author: { firstName: "Robert", lastName: "Martin", dateOfBirth: "1952-12-05" },
    price: 42.0,
    pages: 464,
    dueDays: 14,
    publishingDate: "2008-08-01",
    isbn: "978-0132350884",
    genre: "Software",
    description: "A handbook of agile software craftsmanship.",
  },
  {
    kind: "book",
    title: "The Mythical Man-Month",
    author: { firstName: "Frederick", lastName: "Brooks", dateOfBirth: "1931-04-19" },
    price: 35.75,
    pages: 322,
    dueDays: 21,
    publishingDate: "1975-01-01",
    isbn: "978-0201835953",
    genre: "Software",
    description: "Essays on software engineering.",
  },
  {
    kind: "journal",
    title: "Nature Machine Intelligence",
    author: { firstName: "Ada", lastName: "Lovelace", dateOfBirth: "1815-12-10" },
    price: 120.0,
    pages: 90,
    dueDays: 7,
    publishingDate: "2023-03-01",
    publicationFrequency: "Monthly",
    impactFactor: 25.9,
  },
  {
    kind: "journal",
    title: "Journal of Applied Mathematics",
    author: { firstName: "Emmy", lastName: "Noether", dateOfBirth: "1882-03-23" },
    price: 95.5,
    pages: 140,
    dueDays: 7,
    publishingDate: "2024-01-15",
    publicationFrequency: "Quarterly",
    impactFactor: 3.4,
  },
  {
    kind: "magazine",
    title: "Gadget Weekly",
    // Same author as the journal above, on purpose: two items, one author row.
    author: { firstName: "Ada", lastName: "Lovelace", dateOfBirth: "1815-12-10" },
    price: 5.25,
    pages: 40,
    dueDays: 7,
    publishingDate: "2024-06-01",
    issueNumber: 12,
  },
  {
    kind: "magazine",
    title: "Science Today",
    author: { firstName: "Carl", lastName: "Sagan", dateOfBirth: "1934-11-09" },
    price: 7.99,
    pages: 68,
    dueDays: 7,
    publishingDate: "2025-02-01",
    issueNumber: 245,
  },
  {
    kind: "newspaper",
    title: "The Daily Record",
    author: { firstName: "Nellie", lastName: "Bly", dateOfBirth: "1864-05-05" },
    price: 1.5,
    pages: 24,
    dueDays: 3,
    publishingDate: "2025-01-15",
    issueLanguage: "English",
  },
  {
    kind: "newspaper",
    title: "Al-Ahram Weekly",
    author: { firstName: "Nellie", lastName: "Bly", dateOfBirth: "1864-05-05" },
    price: 2.0,
    pages: 32,
    dueDays: 3,
    publishingDate: "2025-03-10",
    issueLanguage: "Arabic",
  },
];

const CUSTOMERS: CustomerInput[] = [
  {
    firstName: "Ann",
    lastName: "Lee",
    dateOfBirth: "2000-03-03",
    address: "12 Main St",
    phoneNumber: "0555111222",
    student: true,
  },
  {
    firstName: "Omar",
    lastName: "Hassan",
    dateOfBirth: "1995-07-19",
    address: "8 Nile Ave",
    phoneNumber: "0555333444",
    student: false,
  },
  {
    firstName: "Mariam",
    lastName: "Farouk",
    dateOfBirth: "2002-11-30",
    address: "45 Tahrir Sq",
    phoneNumber: "0555777888",
    student: true,
  },
];

async function main() {
  const db = await getDb();

  // Order matters: transactions reference items and customers.
  await db.delete(transactions);
  await db.delete(items);
  await db.delete(customers);
  await db.delete(authors);

  for (const item of ITEMS) await createItem(item);
  for (const customer of CUSTOMERS) await createCustomer(customer);

  // Two open loans, one with a service, plus one already returned so the
  // return screen and the outstanding list both have realistic data.
  await borrow({
    customerId: "110",
    itemId: 1,
    service: { type: "printing", costPerPage: 0.25 },
  });
  await borrow({ customerId: "111", itemId: 4, service: { type: "none" } });
  await borrow({
    customerId: "112",
    itemId: 7,
    service: { type: "proofreading", costPerPage: 0.4 },
  });
  await returnItem("1002");

  console.log(
    `Seeded ${ITEMS.length} items, ${CUSTOMERS.length} customers, 3 transactions (1 returned).`,
  );
  await closeDb();
}

main().catch(async (err) => {
  console.error(err);
  await closeDb().catch(() => {});
  process.exit(1);
});
