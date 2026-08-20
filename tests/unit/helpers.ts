import { runMigrations } from "@/lib/db";
import { createCustomer } from "@/lib/customers/service";
import { createItem } from "@/lib/items/service";
import type { ItemInput } from "@/lib/items/schema";
import type { CustomerInput } from "@/lib/customers/schema";

export async function freshDatabase() {
  await runMigrations();
}

export function bookInput(overrides: Partial<ItemInput> = {}): ItemInput {
  return {
    kind: "book",
    title: "Alpha",
    author: { firstName: "John", lastName: "Smith", dateOfBirth: "1980-01-01" },
    price: 10.5,
    pages: 100,
    dueDays: 14,
    publishingDate: "2020-01-01",
    isbn: "ISBN-111",
    genre: "Fiction",
    description: "First book",
    ...overrides,
  } as ItemInput;
}

export function magazineInput(overrides: Partial<ItemInput> = {}): ItemInput {
  return {
    kind: "magazine",
    title: "Gadget Weekly",
    author: { firstName: "Jane", lastName: "Doe", dateOfBirth: "1985-02-02" },
    price: 5.25,
    pages: 40,
    dueDays: 7,
    publishingDate: "2021-06-01",
    issueNumber: 12,
    ...overrides,
  } as ItemInput;
}

export function customerInput(overrides: Partial<CustomerInput> = {}): CustomerInput {
  return {
    firstName: "Ann",
    lastName: "Lee",
    dateOfBirth: "2000-03-03",
    address: "12 Main St",
    phoneNumber: "0555111222",
    student: true,
    ...overrides,
  };
}

export const seedBook = (o?: Partial<ItemInput>) => createItem(bookInput(o));
export const seedCustomer = (o?: Partial<CustomerInput>) =>
  createCustomer(customerInput(o));
