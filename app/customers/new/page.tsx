import { PageHeader } from "@/components/ui";
import { CustomerForm, EMPTY_CUSTOMER } from "../CustomerForm";

/** Feature 4: add a new customer. */
export default function NewCustomerPage() {
  return (
    <>
      <PageHeader
        title="Add customer"
        description="The customer ID is generated on save."
      />
      <CustomerForm initial={EMPTY_CUSTOMER} submitLabel="Add customer" />
    </>
  );
}
