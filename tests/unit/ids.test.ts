import { beforeAll, describe, expect, it } from "vitest";
import { deleteItem, generateUniqueItemId } from "@/lib/items/service";
import { generateUniqueCustomerId } from "@/lib/customers/service";
import { generateUniqueTransactionId, borrow } from "@/lib/transactions/service";
import { freshDatabase, seedBook, seedCustomer } from "./helpers";

/**
 * The Java generates IDs by scanning upward from a fixed start for the first
 * unused value. That means IDs are reused after a delete, which a database
 * identity column would never do - so these tests pin the behaviour.
 */
describe("unique ID generation", () => {
  beforeAll(freshDatabase);

  it("numbers items from 1", async () => {
    expect(await generateUniqueItemId()).toBe(1);

    const first = await seedBook({ title: "One" });
    expect(first.id).toBe(1);

    const second = await seedBook({ title: "Two" });
    expect(second.id).toBe(2);
  });

  it("reuses an item ID freed by a delete", async () => {
    const third = await seedBook({ title: "Three" });
    expect(third.id).toBe(3);

    // Free up the middle ID; the next item should take 2, not 4.
    await deleteItem(2);
    expect(await generateUniqueItemId()).toBe(2);

    const replacement = await seedBook({ title: "Replacement" });
    expect(replacement.id).toBe(2);
  });

  it("numbers customers from 110, as strings", async () => {
    expect(await generateUniqueCustomerId()).toBe("110");

    const first = await seedCustomer();
    expect(first.id).toBe("110");
    expect(typeof first.id).toBe("string");

    const second = await seedCustomer({ firstName: "Bob" });
    expect(second.id).toBe("111");
  });

  it("numbers transactions from 1000, as strings", async () => {
    expect(await generateUniqueTransactionId()).toBe("1000");

    const result = await borrow({
      customerId: "110",
      itemId: 1,
      service: { type: "none" },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe("1000");
      expect(typeof result.value.id).toBe("string");
    }
  });
});
