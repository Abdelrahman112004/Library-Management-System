import { PageHeader } from "@/components/ui";
import { listCustomers } from "@/lib/customers/service";
import { listItems } from "@/lib/items/service";
import { isItemBorrowed } from "@/lib/transactions/service";
import { BorrowForm } from "./BorrowForm";

export const dynamic = "force-dynamic";

/** Feature 7: borrow transaction, with an optional printing/proofreading service. */
export default async function BorrowPage() {
  const [customers, items] = await Promise.all([listCustomers(), listItems()]);

  // Only offer items that are not already on loan - the same rule the API
  // enforces, surfaced early so the user does not pick an invalid option.
  const availability = await Promise.all(
    items.map(async (item) => ({ item, borrowed: await isItemBorrowed(item.id) })),
  );

  return (
    <>
      <PageHeader
        title="Borrow"
        description="Record a loan for a customer, with an optional extra service."
      />
      <BorrowForm
        customers={customers.map((c) => ({
          id: c.id,
          label: `${c.id} - ${c.firstName} ${c.lastName}`,
        }))}
        items={availability
          .filter(({ borrowed }) => !borrowed)
          .map(({ item }) => ({
            id: String(item.id),
            label: `${item.id} - ${item.title}`,
          }))}
      />
    </>
  );
}
