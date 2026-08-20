import { and, eq, isNull, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  authors,
  customers,
  items,
  transactions,
  type Transaction,
} from "@/lib/db/schema";
import { findCustomerById } from "@/lib/customers/service";
import { findItemById } from "@/lib/items/service";
import type { BorrowInput } from "./schema";

/** Every failure the Java borrow/return paths can report. */
export type BorrowError =
  | "customer-not-found"
  | "item-not-found"
  | "already-borrowed";

export type ReturnError = "not-found" | "already-returned";

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Java: generateUniqueTransactionID() starts at 1000 and returns the first
 * unused value as a String.
 */
export async function generateUniqueTransactionId(): Promise<string> {
  const db = await getDb();
  const rows = await db.select({ id: transactions.id }).from(transactions);
  const taken = new Set(rows.map((r) => r.id));

  let n = 1000;
  while (taken.has(String(n))) n++;
  return String(n);
}

/**
 * Java: isItemBorrowed() - an item is on loan when a transaction references it
 * and has a null checkInDate.
 */
export async function isItemBorrowed(itemId: number): Promise<boolean> {
  const db = await getDb();
  const rows = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(eq(transactions.itemId, itemId), isNull(transactions.checkInDate)))
    .limit(1);
  return rows.length > 0;
}

function today(): string {
  // Java uses LocalDate.now(); dates are stored without a time component.
  return new Date().toISOString().slice(0, 10);
}

/**
 * Java: borrowTransaction() checks the customer exists, the item exists, and
 * the item is not already on loan - in that order - then records the loan with
 * today's checkout date and a null check-in date.
 */
export async function borrow(
  input: BorrowInput,
): Promise<Result<Transaction, BorrowError>> {
  const db = await getDb();
  const customer = await findCustomerById(input.customerId);
  if (!customer) return { ok: false, error: "customer-not-found" };

  const item = await findItemById(input.itemId);
  if (!item) return { ok: false, error: "item-not-found" };

  if (await isItemBorrowed(input.itemId)) {
    return { ok: false, error: "already-borrowed" };
  }

  const id = await generateUniqueTransactionId();
  const service = input.service;

  const [created] = await db
    .insert(transactions)
    .values({
      id,
      customerId: customer.id,
      itemId: item.id,
      checkOutDate: today(),
      checkInDate: null,
      printing: service.type === "printing",
      printingCostPerPage: service.type === "printing" ? service.costPerPage : null,
      proofReading: service.type === "proofreading",
      proofReadingCostPerPage:
        service.type === "proofreading" ? service.costPerPage : null,
    })
    .returning();

  return { ok: true, value: created };
}

/**
 * Java: returnTransaction() finds the transaction by ID and stamps today's
 * check-in date, provided it is still open.
 */
export async function returnItem(
  transactionId: string,
): Promise<Result<Transaction, ReturnError>> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(transactions)
    .where(sql`lower(${transactions.id}) = lower(${transactionId})`)
    .limit(1);

  const existing = rows[0];
  if (!existing) return { ok: false, error: "not-found" };
  if (existing.checkInDate) return { ok: false, error: "already-returned" };

  const [updated] = await db
    .update(transactions)
    .set({ checkInDate: today() })
    .where(eq(transactions.id, existing.id))
    .returning();

  return { ok: true, value: updated };
}

export type OutstandingRow = {
  transactionId: string;
  itemId: number;
  title: string;
  authorLastName: string;
  checkOutDate: string;
  dueDays: number;
};

/**
 * Java: ListItemsnotyetreturned() - open transactions for one customer,
 * matching the customer ID case-insensitively.
 */
export async function listOutstandingForCustomer(
  customerId: string,
): Promise<OutstandingRow[]> {
  const db = await getDb();
  return db
    .select({
      transactionId: transactions.id,
      itemId: items.id,
      title: items.title,
      authorLastName: authors.lastName,
      checkOutDate: transactions.checkOutDate,
      dueDays: items.dueDays,
    })
    .from(transactions)
    .innerJoin(items, eq(transactions.itemId, items.id))
    .innerJoin(authors, eq(items.authorId, authors.id))
    .where(
      and(
        sql`lower(${transactions.customerId}) = lower(${customerId})`,
        isNull(transactions.checkInDate),
      ),
    )
    .orderBy(transactions.id);
}

export async function listTransactions() {
  const db = await getDb();
  return db
    .select({
      id: transactions.id,
      checkOutDate: transactions.checkOutDate,
      checkInDate: transactions.checkInDate,
      printing: transactions.printing,
      printingCostPerPage: transactions.printingCostPerPage,
      proofReading: transactions.proofReading,
      proofReadingCostPerPage: transactions.proofReadingCostPerPage,
      itemId: items.id,
      itemTitle: items.title,
      customerId: customers.id,
      customerFirstName: customers.firstName,
      customerLastName: customers.lastName,
    })
    .from(transactions)
    .innerJoin(items, eq(transactions.itemId, items.id))
    .innerJoin(customers, eq(transactions.customerId, customers.id))
    .orderBy(transactions.id);
}
