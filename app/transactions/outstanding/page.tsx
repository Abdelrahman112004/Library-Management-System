import {
  Alert,
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { listCustomers } from "@/lib/customers/service";
import { listOutstandingForCustomer } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

/**
 * Feature 9: items not yet returned, per customer.
 *
 * A plain GET form so the search term lives in the URL - shareable, and it
 * works without JavaScript.
 */
export default async function OutstandingPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const searched = customerId?.trim() ?? "";

  const rows = searched ? await listOutstandingForCustomer(searched) : [];
  const customers = await listCustomers();

  return (
    <>
      <PageHeader
        title="Items not yet returned"
        description="Search by customer ID to see what they still have out."
      />

      <div className="space-y-6">
        <Card>
          <form method="GET" className="flex flex-wrap items-end gap-3">
            <div className="min-w-[16rem] flex-1">
              <Field
                label="Customer ID"
                htmlFor="customerId"
                hint={
                  customers.length
                    ? `Known IDs: ${customers.map((c) => c.id).join(", ")}`
                    : "No customers yet."
                }
              >
                <Input
                  id="customerId"
                  name="customerId"
                  defaultValue={searched}
                  placeholder="110"
                />
              </Field>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </Card>

        {searched && rows.length === 0 ? (
          <Alert tone="info">
            There are no items outstanding for customer {searched}.
          </Alert>
        ) : null}

        {rows.length > 0 ? (
          <Table
            head={
              <tr>
                <Th>Transaction</Th>
                <Th>Item ID</Th>
                <Th>Title</Th>
                <Th>Checked out</Th>
                <Th>Due days</Th>
              </tr>
            }
          >
            {rows.map((row) => (
              <tr key={row.transactionId}>
                <Td className="font-medium">{row.transactionId}</Td>
                <Td className="text-slate-500">{row.itemId}</Td>
                <Td>{row.title}</Td>
                <Td>{row.checkOutDate}</Td>
                <Td>{row.dueDays}</Td>
              </tr>
            ))}
          </Table>
        ) : null}
      </div>
    </>
  );
}
