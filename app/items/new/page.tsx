import { PageHeader } from "@/components/ui";
import { EMPTY_ITEM, ItemForm } from "../ItemForm";

/** Feature 1: add a new Book, Scientific Journal, Magazine or News Paper. */
export default function NewItemPage() {
  return (
    <>
      <PageHeader
        title="Add item"
        description="Pick a type; the fields below change to match it."
      />
      <ItemForm initial={EMPTY_ITEM} submitLabel="Add item" />
    </>
  );
}
