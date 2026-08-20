import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { findCustomerById } from "@/lib/customers/service";
import { CustomerForm } from "../../CustomerForm";

export const dynamic = "force-dynamic";

/** Feature 5 and 6: update or delete a customer, found by customer ID. */
export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await findCustomerById(id);
  if (!customer) notFound();

  return (
    <>
      <PageHeader
        title={`Edit ${customer.firstName} ${customer.lastName}`}
        description={`Customer ID ${customer.id}`}
      />
      <CustomerForm
        initial={{
          firstName: customer.firstName,
          lastName: customer.lastName,
          dateOfBirth: customer.dateOfBirth,
          address: customer.address,
          phoneNumber: customer.phoneNumber,
          student: customer.student,
        }}
        customerId={customer.id}
        submitLabel="Save changes"
      />
    </>
  );
}
