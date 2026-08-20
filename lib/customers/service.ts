import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { customers, type Customer } from "@/lib/db/schema";
import type { CustomerInput } from "./schema";

/**
 * Java: generateUniqueCustomerID() starts at 110 and returns the first unused
 * value as a String. Both the starting point and the string type are quirks of
 * the original, kept deliberately.
 */
export async function generateUniqueCustomerId(): Promise<string> {
  const db = await getDb();
  const rows = await db.select({ id: customers.id }).from(customers);
  const taken = new Set(rows.map((r) => r.id));

  let n = 110;
  while (taken.has(String(n))) n++;
  return String(n);
}

export async function listCustomers(): Promise<Customer[]> {
  const db = await getDb();
  return db.select().from(customers).orderBy(customers.id);
}

/** Java: findCustomerbyId() uses equalsIgnoreCase. */
export async function findCustomerById(id: string): Promise<Customer | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(customers)
    .where(sql`lower(${customers.id}) = lower(${id})`)
    .limit(1);
  return rows[0] ?? null;
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  const db = await getDb();
  const id = await generateUniqueCustomerId();
  const [created] = await db
    .insert(customers)
    .values({ id, ...input })
    .returning();
  return created;
}

export async function updateCustomer(
  id: string,
  input: CustomerInput,
): Promise<Customer | null> {
  const db = await getDb();
  const [updated] = await db
    .update(customers)
    .set(input)
    .where(eq(customers.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const db = await getDb();
  const deleted = await db.delete(customers).where(eq(customers.id, id)).returning();
  return deleted.length > 0;
}
