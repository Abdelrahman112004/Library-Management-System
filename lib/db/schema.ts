import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

/**
 * The Java model is Item + four subclasses (Book, ScientificJournal, Magazine,
 * NewsPaper) held in a single ArrayList<Item>. That maps to one table with a
 * `kind` discriminator and nullable subtype columns, which keeps find-by-id and
 * find-by-title a single query with no joins. Zod enforces which subtype
 * columns are required for each kind.
 */
export const itemKind = pgEnum("item_kind", [
  "book",
  "journal",
  "magazine",
  "newspaper",
]);

export const authors = pgTable("authors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
});

export const items = pgTable("items", {
  // Not an identity column: the Java assigns the first unused integer starting
  // at 1, so a deleted item's ID gets reused. generateUniqueItemId() in
  // lib/items/service.ts reproduces that.
  id: integer("id").primaryKey(),
  kind: itemKind("kind").notNull(),
  title: text("title").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => authors.id, { onDelete: "restrict" }),
  price: doublePrecision("price").notNull(),
  pages: integer("pages").notNull(),
  dueDays: integer("due_days").notNull(),
  publishingDate: date("publishing_date").notNull(),

  // book
  isbn: text("isbn"),
  genre: text("genre"),
  description: text("description"),

  // journal
  publicationFrequency: text("publication_frequency"),
  impactFactor: doublePrecision("impact_factor"),

  // magazine
  issueNumber: integer("issue_number"),

  // newspaper
  issueLanguage: text("issue_language"),
});

export const customers = pgTable("customers", {
  // Text, and numbered from "110" - both quirks of the Java original.
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  student: boolean("student").notNull().default(false),
});

export const transactions = pgTable("transactions", {
  // Text, numbered from "1000".
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "restrict" }),
  checkOutDate: date("check_out_date").notNull(),
  // Null until returned. This is what marks an item as still borrowed.
  checkInDate: date("check_in_date"),

  // The Java Service is owned by exactly one Transaction and is never shared or
  // queried on its own, so it is inlined rather than given its own table.
  printing: boolean("printing").notNull().default(false),
  printingCostPerPage: doublePrecision("printing_cost_per_page"),
  proofReading: boolean("proof_reading").notNull().default(false),
  proofReadingCostPerPage: doublePrecision("proof_reading_cost_per_page"),
});

export type Author = typeof authors.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type ItemKind = (typeof itemKind.enumValues)[number];
