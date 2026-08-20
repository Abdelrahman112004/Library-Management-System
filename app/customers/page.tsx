import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import { Button, EmptyState, PageHeader, Table, Td, Th } from "@/components/ui";
import { listCustomers } from "@/lib/customers/service";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <>
      <PageHeader
        title="Customers"
        description="Customer IDs are assigned automatically, starting at 110."
        action={
          <Link href="/customers/new">
            <Button>Add customer</Button>
          </Link>
        }
      />

      {customers.length === 0 ? (
        <EmptyState>
          No customers yet.{" "}
          <Link href="/customers/new" className="font-medium underline">
            Add the first one
          </Link>
          .
        </EmptyState>
      ) : (
        <Table
          head={
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Phone</Th>
              <Th>Student</Th>
              <Th>Actions</Th>
            </tr>
          }
        >
          {customers.map((customer) => (
            <tr key={customer.id}>
              <Td className="font-medium">{customer.id}</Td>
              <Td>
                {customer.firstName} {customer.lastName}
              </Td>
              <Td>{customer.phoneNumber}</Td>
              <Td>{customer.student ? "Yes" : "No"}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <DeleteButton
                    endpoint={`/api/customers/${customer.id}`}
                    label={`Delete ${customer.id}`}
                  />
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
