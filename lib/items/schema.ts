import { z } from "zod";

/**
 * Mirrors what the Java accepts, and nothing more.
 *
 * The console app validates by parsing: LocalDate.parse for dates,
 * nextInt/nextDouble for numbers, and raw strings for everything else. So these
 * schemas check type and presence only. No range rules (minimum price, positive
 * page counts) are added here, because the Java has none and the brief says not
 * to introduce new business rules.
 */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Not a real date");

const required = (label: string) => z.string().trim().min(1, `${label} is required`);

export const authorSchema = z.object({
  firstName: required("Author first name"),
  lastName: required("Author last name"),
  dateOfBirth: isoDate,
});

const itemBase = {
  title: required("Title"),
  author: authorSchema,
  price: z.coerce.number().finite("Price must be a number"),
  pages: z.coerce.number().int("Pages must be a whole number"),
  dueDays: z.coerce.number().int("Due days must be a whole number"),
  publishingDate: isoDate,
};

export const bookSchema = z.object({
  ...itemBase,
  kind: z.literal("book"),
  isbn: required("ISBN"),
  genre: required("Genre"),
  description: required("Description"),
});

export const journalSchema = z.object({
  ...itemBase,
  kind: z.literal("journal"),
  publicationFrequency: required("Publication frequency"),
  impactFactor: z.coerce.number().finite("Impact factor must be a number"),
});

export const magazineSchema = z.object({
  ...itemBase,
  kind: z.literal("magazine"),
  issueNumber: z.coerce.number().int("Issue number must be a whole number"),
});

export const newspaperSchema = z.object({
  ...itemBase,
  kind: z.literal("newspaper"),
  issueLanguage: required("Issue language"),
});

export const itemSchema = z.discriminatedUnion("kind", [
  bookSchema,
  journalSchema,
  magazineSchema,
  newspaperSchema,
]);

export type ItemInput = z.infer<typeof itemSchema>;
export type AuthorInput = z.infer<typeof authorSchema>;

export const ITEM_KIND_LABELS: Record<ItemInput["kind"], string> = {
  book: "Book",
  journal: "Scientific Journal",
  magazine: "Magazine",
  newspaper: "News Paper",
};
