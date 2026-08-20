import { PageHeader, Table, Td, Th } from "@/components/ui";
import { listTransactions } from "@/lib/transactions/service";
import { ReturnForm } from "./ReturnForm";

export const dynamic = "force-dynamic";

export default async function ReturnPage() {
  const transactions = await listTransactions();
  const open = transactions.filter((t) => t.checkInDate === null);

  return (
    <>
      <PageHeader
        title="Return"
        description="Close a loan using the transaction ID issued at borrow time."
      />

      <div className="space-y-8">
        <ReturnForm />

        {open.length > 0 ? (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-slate-700">
              Currently on loan
            </h2>
            <Table
              head={
                <tr>
                  <Th>Transaction</Th>
                  <Th>Item</Th>
                  <Th>Customer</Th>
                  <Th>Checked out</Th>
                </tr>
              }
            >
              {open.map((t) => (
                <tr key={t.id}>
                  <Td className="font-medium">{t.id}</Td>
                  <Td>{t.itemTitle}</Td>
                  <Td>
                    {t.customerId} - {t.customerFirstName} {t.customerLastName}
                  </Td>
                  <Td>{t.checkOutDate}</Td>
                </tr>
              ))}
            </Table>
          </section>
        ) : null}
      </div>
    </>
  );
}
