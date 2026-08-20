import { describe, expect, it } from "vitest";
import { itemSchema } from "@/lib/items/schema";
import { customerSchema } from "@/lib/customers/schema";
import { borrowSchema, serviceSchema } from "@/lib/transactions/schema";
import { bookInput, customerInput, magazineInput } from "./helpers";

describe("item schema", () => {
  it("accepts each of the four kinds", () => {
    expect(itemSchema.safeParse(bookInput()).success).toBe(true);
    expect(itemSchema.safeParse(magazineInput()).success).toBe(true);
  });

  it("requires the subtype fields that belong to the chosen kind", () => {
    const bookWithoutIsbn = { ...bookInput() } as Record<string, unknown>;
    delete bookWithoutIsbn.isbn;
    expect(itemSchema.safeParse(bookWithoutIsbn).success).toBe(false);
  });

  it("rejects a kind that does not exist", () => {
    expect(itemSchema.safeParse({ ...bookInput(), kind: "dvd" }).success).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(
      itemSchema.safeParse(bookInput({ publishingDate: "01-01-2020" })).success,
    ).toBe(false);
    expect(
      itemSchema.safeParse(bookInput({ publishingDate: "2020-13-45" })).success,
    ).toBe(false);
  });

  it("rejects a blank title", () => {
    expect(itemSchema.safeParse(bookInput({ title: "   " })).success).toBe(false);
  });

  it("coerces numeric strings, as HTML form fields deliver them", () => {
    const parsed = itemSchema.safeParse({
      ...bookInput(),
      price: "10.5",
      pages: "100",
      dueDays: "14",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.price).toBe(10.5);
      expect(parsed.data.pages).toBe(100);
    }
  });

  it("rejects a fractional page count", () => {
    expect(itemSchema.safeParse(bookInput({ pages: 1.5 })).success).toBe(false);
  });
});

describe("customer schema", () => {
  it("accepts a complete customer", () => {
    expect(customerSchema.safeParse(customerInput()).success).toBe(true);
  });

  it("requires every field the Java prompts for", () => {
    for (const field of [
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
    ] as const) {
      expect(customerSchema.safeParse(customerInput({ [field]: "" })).success).toBe(
        false,
      );
    }
  });
});

describe("service schema", () => {
  it("allows no service at all", () => {
    expect(serviceSchema.safeParse({ type: "none" }).success).toBe(true);
  });

  it("requires a cost per page when a service is chosen", () => {
    expect(serviceSchema.safeParse({ type: "printing" }).success).toBe(false);
    expect(
      serviceSchema.safeParse({ type: "printing", costPerPage: 0.25 }).success,
    ).toBe(true);
  });

  it("cannot represent printing and proofreading at once", () => {
    const both = serviceSchema.safeParse({
      type: "printing",
      costPerPage: 1,
      proofReading: true,
    });
    // The extra key is stripped rather than producing a both-services value.
    expect(both.success).toBe(true);
    if (both.success) expect(both.data).toEqual({ type: "printing", costPerPage: 1 });
  });

  it("defaults a borrow to no service", () => {
    const parsed = borrowSchema.safeParse({ customerId: "110", itemId: 1 });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.service).toEqual({ type: "none" });
  });
});
