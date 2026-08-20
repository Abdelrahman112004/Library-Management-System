import { expect, test } from "@playwright/test";

/**
 * One ordered journey through every feature, mirroring the Java console menu.
 *
 * Selectors are role- and label-based so small styling changes do not break the
 * suite. The database starts empty (see global-setup), so the generated IDs are
 * predictable: item 1, customer 110, transaction 1000.
 */
test.describe.configure({ mode: "serial" });

test("add a book", async ({ page }) => {
  await page.goto("/items/new");

  await page.getByLabel("Item type").selectOption("book");
  await page.getByLabel("Title").fill("Alpha");
  await page.getByLabel("Author first name").fill("John");
  await page.getByLabel("Author last name").fill("Smith");
  await page.getByLabel("Author date of birth").fill("1980-01-01");
  await page.getByLabel("Price").fill("10.5");
  await page.getByLabel("Pages").fill("100");
  await page.getByLabel("Due days").fill("14");
  await page.getByLabel("Publishing date").fill("2020-01-01");
  await page.getByLabel("ISBN").fill("ISBN-111");
  await page.getByLabel("Genre").fill("Fiction");
  await page.getByLabel("Description").fill("First book");

  await page.getByRole("button", { name: "Add item" }).click();

  await expect(page).toHaveURL(/\/items$/);
  const row = page.getByRole("row", { name: /Alpha/ });
  await expect(row).toBeVisible();
  await expect(row).toContainText("Book");
  await expect(row).toContainText("10.50");
});

test("add a magazine, and titles stay distinct", async ({ page }) => {
  await page.goto("/items/new");

  await page.getByLabel("Item type").selectOption("magazine");
  await page.getByLabel("Title").fill("Gadget Weekly");
  await page.getByLabel("Author first name").fill("Jane");
  await page.getByLabel("Author last name").fill("Doe");
  await page.getByLabel("Author date of birth").fill("1985-02-02");
  await page.getByLabel("Price").fill("5.25");
  await page.getByLabel("Pages").fill("40");
  await page.getByLabel("Due days").fill("7");
  await page.getByLabel("Publishing date").fill("2021-06-01");
  await page.getByLabel("Issue number").fill("12");

  await page.getByRole("button", { name: "Add item" }).click();
  await expect(page).toHaveURL(/\/items$/);

  // The Java stored `title` in a static field, so adding a second item
  // renamed the first. Both titles must survive.
  await expect(page.getByRole("row", { name: /Alpha/ })).toBeVisible();
  await expect(page.getByRole("row", { name: /Gadget Weekly/ })).toBeVisible();
});

test("shows validation errors instead of saving", async ({ page }) => {
  await page.goto("/items/new");
  await page.getByRole("button", { name: "Add item" }).click();

  await expect(page.getByText("Title is required")).toBeVisible();
  await expect(page).toHaveURL(/\/items\/new$/);
});

test("update an item", async ({ page }) => {
  await page.goto("/items");
  await page
    .getByRole("row", { name: /Alpha/ })
    .getByRole("link", { name: "Edit" })
    .click();

  await page.getByLabel("Title").fill("Alpha Revised");
  await page.getByLabel("Due days").fill("21");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page).toHaveURL(/\/items$/);
  const row = page.getByRole("row", { name: /Alpha Revised/ });
  await expect(row).toBeVisible();
  await expect(row).toContainText("21");
});

test("add a customer and get ID 110", async ({ page }) => {
  await page.goto("/customers/new");

  await page.getByLabel("First name").fill("Ann");
  await page.getByLabel("Last name").fill("Lee");
  await page.getByLabel("Date of birth").fill("2000-03-03");
  await page.getByLabel("Address").fill("12 Main St");
  await page.getByLabel("Phone number").fill("0555111222");
  await page.getByLabel("Student").check();

  await page.getByRole("button", { name: "Add customer" }).click();

  await expect(page).toHaveURL(/\/customers$/);
  const row = page.getByRole("row", { name: /Ann Lee/ });
  await expect(row).toBeVisible();
  await expect(row).toContainText("110");
  await expect(row).toContainText("Yes");
});

test("borrow an item and receive a transaction ID", async ({ page }) => {
  await page.goto("/transactions/borrow");

  // Option values are the generated IDs, which earlier tests pinned:
  // customer 110, item 1.
  await page.getByLabel("Customer").selectOption("110");
  await page.getByLabel("Item").selectOption("1");
  await page.getByLabel("Service").selectOption("printing");
  await page.getByLabel("Cost per page").fill("0.25");

  await page.getByRole("button", { name: "Borrow item" }).click();

  await expect(page.getByRole("status")).toContainText("1000");
});

test("refuses to borrow an item that is already out", async ({ page }) => {
  await page.goto("/transactions/borrow");

  // The borrowed item is filtered out of the dropdown, so go via the API to
  // prove the server-side rule holds regardless of the UI.
  const response = await page.request.post("/api/transactions/borrow", {
    data: { customerId: "110", itemId: 1, service: { type: "none" } },
  });

  expect(response.status()).toBe(409);
  expect(await response.json()).toMatchObject({
    error: "Sorry, the item is already borrowed.",
  });
});

test("lists what a customer has not returned", async ({ page }) => {
  await page.goto("/transactions/outstanding");

  await page.getByLabel("Customer ID").fill("110");
  await page.getByRole("button", { name: "Search" }).click();

  const row = page.getByRole("row", { name: /Alpha Revised/ });
  await expect(row).toBeVisible();
  await expect(row).toContainText("1000");
});

test("finds publications by author last name", async ({ page }) => {
  await page.goto("/authors");

  await page.getByLabel("Author last name").fill("Smith");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByRole("row", { name: /Alpha Revised/ })).toBeVisible();
  // The Java listed every magazine regardless of the author searched.
  await expect(page.getByRole("row", { name: /Gadget Weekly/ })).toHaveCount(0);

  await page.getByLabel("Author last name").fill("Doe");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByRole("row", { name: /Gadget Weekly/ })).toBeVisible();
  await expect(page.getByRole("row", { name: /Alpha Revised/ })).toHaveCount(0);
});

test("return the item, then it can be borrowed again", async ({ page }) => {
  await page.goto("/transactions/return");

  await page.getByLabel("Transaction ID").fill("1000");
  await page.getByRole("button", { name: "Return item" }).click();

  await expect(page.getByRole("status")).toContainText("returned successfully");

  // Returning twice is rejected. Filtered by text because Next.js renders its
  // own route announcer with role="alert", which would match too.
  await page.getByLabel("Transaction ID").fill("1000");
  await page.getByRole("button", { name: "Return item" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "already been returned" }),
  ).toBeVisible();

  // And the item is available again.
  await page.goto("/transactions/outstanding?customerId=110");
  await expect(page.getByText("no items outstanding")).toBeVisible();
});

test("delete an item", async ({ page }) => {
  await page.goto("/items");

  const row = page.getByRole("row", { name: /Gadget Weekly/ });
  await row.getByRole("button", { name: /Delete/ }).click();
  await row.getByRole("button", { name: "Confirm delete" }).click();

  await expect(page.getByRole("row", { name: /Gadget Weekly/ })).toHaveCount(0);
  await expect(page.getByRole("row", { name: /Alpha Revised/ })).toBeVisible();
});
