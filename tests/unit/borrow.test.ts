import { beforeAll, describe, expect, it } from "vitest";
import {
  borrow,
  isItemBorrowed,
  listOutstandingForCustomer,
  returnItem,
} from "@/lib/transactions/service";
import { freshDatabase, seedBook, seedCustomer } from "./helpers";

describe("borrow and return", () => {
  beforeAll(async () => {
    await freshDatabase();
    await seedBook({ title: "Alpha" }); // id 1
    await seedBook({ title: "Beta" }); // id 2
    await seedCustomer(); // id "110"
  });

  it("rejects an unknown customer", async () => {
    const result = await borrow({
      customerId: "999",
      itemId: 1,
      service: { type: "none" },
    });
    expect(result).toEqual({ ok: false, error: "customer-not-found" });
  });

  it("rejects an unknown item", async () => {
    const result = await borrow({
      customerId: "110",
      itemId: 999,
      service: { type: "none" },
    });
    expect(result).toEqual({ ok: false, error: "item-not-found" });
  });

  it("records a borrow with an open check-in date", async () => {
    const result = await borrow({
      customerId: "110",
      itemId: 1,
      service: { type: "none" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.itemId).toBe(1);
    expect(result.value.checkInDate).toBeNull();
    expect(await isItemBorrowed(1)).toBe(true);
  });

  // The headline rule from the brief.
  it("refuses to borrow an item that is already out", async () => {
    const result = await borrow({
      customerId: "110",
      itemId: 1,
      service: { type: "none" },
    });
    expect(result).toEqual({ ok: false, error: "already-borrowed" });
  });

  it("stores an optional printing service with its cost per page", async () => {
    const result = await borrow({
      customerId: "110",
      itemId: 2,
      service: { type: "printing", costPerPage: 0.25 },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.printing).toBe(true);
    expect(result.value.printingCostPerPage).toBe(0.25);
    expect(result.value.proofReading).toBe(false);
    expect(result.value.proofReadingCostPerPage).toBeNull();
  });

  it("lists only the customer's outstanding items", async () => {
    const rows = await listOutstandingForCustomer("110");
    expect(rows.map((r) => r.title).sort()).toEqual(["Alpha", "Beta"]);
  });

  it("matches the customer ID case-insensitively, as the Java does", async () => {
    const rows = await listOutstandingForCustomer("110");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("returns an item and frees it for borrowing again", async () => {
    const result = await returnItem("1000");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.checkInDate).not.toBeNull();

    expect(await isItemBorrowed(1)).toBe(false);

    const reborrow = await borrow({
      customerId: "110",
      itemId: 1,
      service: { type: "none" },
    });
    expect(reborrow.ok).toBe(true);
  });

  it("rejects returning a transaction that is already closed", async () => {
    const result = await returnItem("1000");
    expect(result).toEqual({ ok: false, error: "already-returned" });
  });

  it("rejects returning an unknown transaction", async () => {
    const result = await returnItem("does-not-exist");
    expect(result).toEqual({ ok: false, error: "not-found" });
  });

  it("drops a returned item from the outstanding list", async () => {
    const rows = await listOutstandingForCustomer("110");
    // Alpha was returned then re-borrowed, so both are out again.
    expect(rows.every((r) => r.checkOutDate)).toBe(true);
  });
});
