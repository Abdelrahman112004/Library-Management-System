import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { authors, items, type Item } from "@/lib/db/schema";
import type { ItemInput } from "./schema";

export type ItemWithAuthor = Item & {
  author: { id: number; firstName: string; lastName: string; dateOfBirth: string };
};

const AUTHOR_COLUMNS = {
  id: authors.id,
  firstName: authors.firstName,
  lastName: authors.lastName,
  dateOfBirth: authors.dateOfBirth,
};

const ITEM_COLUMNS = {
  id: items.id,
  kind: items.kind,
  title: items.title,
  authorId: items.authorId,
  price: items.price,
  pages: items.pages,
  dueDays: items.dueDays,
  publishingDate: items.publishingDate,
  isbn: items.isbn,
  genre: items.genre,
  description: items.description,
  publicationFrequency: items.publicationFrequency,
  impactFactor: items.impactFactor,
  issueNumber: items.issueNumber,
  issueLanguage: items.issueLanguage,
  author: AUTHOR_COLUMNS,
};

// Takes the handle rather than awaiting one: a Drizzle query builder is
// thenable, so `await withAuthor()` would run the query instead of returning
// the builder to chain .where() onto.
function withAuthor(db: Awaited<ReturnType<typeof getDb>>) {
  return db
    .select(ITEM_COLUMNS)
    .from(items)
    .innerJoin(authors, eq(items.authorId, authors.id));
}

/**
 * Java: generateUniqueItemID() walks up from 1 and returns the first ID that
 * findItemById() does not find. So IDs are reused after a delete - if items 1
 * and 3 exist, the next item is 2, not 4. Reproduced here rather than using a
 * database identity column, which would never reuse.
 */
export async function generateUniqueItemId(): Promise<number> {
  const db = await getDb();
  const rows = await db.select({ id: items.id }).from(items);
  const taken = new Set(rows.map((r) => r.id));

  let id = 1;
  while (taken.has(id)) id++;
  return id;
}

async function upsertAuthor(input: ItemInput["author"]) {
  // Java keeps an authors ArrayList and only adds an author if it is not
  // already present. Author has no equals() override, so that check compares
  // identity and never matches - every item gets its own Author object. Here we
  // match on the three fields, which is what the Java meant to do.
  const db = await getDb();
  const existing = await db
    .select()
    .from(authors)
    .where(
      and(
        eq(authors.firstName, input.firstName),
        eq(authors.lastName, input.lastName),
        eq(authors.dateOfBirth, input.dateOfBirth),
      ),
    )
    .limit(1);

  if (existing[0]) return existing[0];

  const [created] = await db.insert(authors).values(input).returning();
  return created;
}

function subtypeColumns(input: ItemInput) {
  switch (input.kind) {
    case "book":
      return { isbn: input.isbn, genre: input.genre, description: input.description };
    case "journal":
      return {
        publicationFrequency: input.publicationFrequency,
        impactFactor: input.impactFactor,
      };
    case "magazine":
      return { issueNumber: input.issueNumber };
    case "newspaper":
      return { issueLanguage: input.issueLanguage };
  }
}

export async function createItem(input: ItemInput): Promise<Item> {
  const db = await getDb();
  const author = await upsertAuthor(input.author);
  const id = await generateUniqueItemId();

  const [created] = await db
    .insert(items)
    .values({
      id,
      kind: input.kind,
      title: input.title,
      authorId: author.id,
      price: input.price,
      pages: input.pages,
      dueDays: input.dueDays,
      publishingDate: input.publishingDate,
      ...subtypeColumns(input),
    })
    .returning();

  return created;
}

export async function updateItem(id: number, input: ItemInput): Promise<Item | null> {
  const db = await getDb();
  const author = await upsertAuthor(input.author);

  const [updated] = await db
    .update(items)
    .set({
      kind: input.kind,
      title: input.title,
      authorId: author.id,
      price: input.price,
      pages: input.pages,
      dueDays: input.dueDays,
      publishingDate: input.publishingDate,
      // Clear every subtype column first so changing kind cannot leave stale
      // fields from the previous kind behind.
      isbn: null,
      genre: null,
      description: null,
      publicationFrequency: null,
      impactFactor: null,
      issueNumber: null,
      issueLanguage: null,
      ...subtypeColumns(input),
    })
    .where(eq(items.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteItem(id: number): Promise<boolean> {
  const db = await getDb();
  const deleted = await db.delete(items).where(eq(items.id, id)).returning();
  return deleted.length > 0;
}

export async function listItems(): Promise<ItemWithAuthor[]> {
  const db = await getDb();
  return (await withAuthor(db).orderBy(items.id)) as ItemWithAuthor[];
}

export async function findItemById(id: number): Promise<ItemWithAuthor | null> {
  const db = await getDb();
  const rows = (await withAuthor(db)
    .where(eq(items.id, id))
    .limit(1)) as ItemWithAuthor[];
  return rows[0] ?? null;
}

/** Java: findItemByTitle() compares with trim() + equalsIgnoreCase(). */
export async function findItemByTitle(title: string): Promise<ItemWithAuthor | null> {
  const db = await getDb();
  const rows = (await withAuthor(db).where(
    sql`lower(trim(${items.title})) = lower(trim(${title}))`,
  )) as ItemWithAuthor[];
  return rows[0] ?? null;
}

/**
 * Java: listAllAuthorPublications() matches the author's last name with
 * equalsIgnoreCase. In the original this filter was only applied to books and
 * journals - magazines and newspapers were printed regardless of the name
 * searched. Applied to every kind here, matching the fixed Java.
 */
export async function findItemsByAuthorLastName(
  lastName: string,
): Promise<ItemWithAuthor[]> {
  const db = await getDb();
  return (await withAuthor(db)
    .where(sql`lower(${authors.lastName}) = lower(${lastName})`)
    .orderBy(items.id)) as ItemWithAuthor[];
}
