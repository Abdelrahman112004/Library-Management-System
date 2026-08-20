import { beforeAll, describe, expect, it } from "vitest";
import { findItemByTitle, findItemsByAuthorLastName } from "@/lib/items/service";
import { findCustomerById } from "@/lib/customers/service";
import { createItem } from "@/lib/items/service";
import { freshDatabase, bookInput, magazineInput, seedCustomer } from "./helpers";

describe("searching", () => {
  beforeAll(async () => {
    await freshDatabase();
    await createItem(bookInput({ title: "Alpha" })); // author Smith
    await createItem(magazineInput({ title: "Gadget Weekly" })); // author Doe
    await seedCustomer();
  });

  it("finds an item by title, ignoring case and surrounding space", async () => {
    expect((await findItemByTitle("alpha"))?.title).toBe("Alpha");
    expect((await findItemByTitle("  ALPHA  "))?.title).toBe("Alpha");
  });

  it("returns null for a title that does not exist", async () => {
    expect(await findItemByTitle("Nothing")).toBeNull();
  });

  /**
   * The Java applied the author filter to books and journals but not to
   * magazines or newspapers, so searching any name listed every magazine.
   * These two tests pin the fixed behaviour.
   */
  it("returns only that author's publications", async () => {
    const smith = await findItemsByAuthorLastName("Smith");
    expect(smith.map((i) => i.title)).toEqual(["Alpha"]);
  });

  it("does not leak magazines by other authors into the results", async () => {
    const doe = await findItemsByAuthorLastName("Doe");
    expect(doe.map((i) => i.title)).toEqual(["Gadget Weekly"]);

    const nobody = await findItemsByAuthorLastName("Nobody");
    expect(nobody).toEqual([]);
  });

  it("matches the author last name ignoring case", async () => {
    expect((await findItemsByAuthorLastName("sMiTh")).length).toBe(1);
  });

  it("finds a customer by ID ignoring case", async () => {
    expect((await findCustomerById("110"))?.firstName).toBe("Ann");
    expect(await findCustomerById("999")).toBeNull();
  });
});
