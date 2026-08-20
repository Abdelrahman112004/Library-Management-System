import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { findItemById } from "@/lib/items/service";
import { ItemForm, type ItemFormValues } from "../../ItemForm";

export const dynamic = "force-dynamic";

const str = (value: string | number | null) =>
  value === null || value === undefined ? "" : String(value);

/** Feature 2 and 3: update or delete an existing item. */
export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await findItemById(itemId);
  if (!item) notFound();

  const initial: ItemFormValues = {
    kind: item.kind,
    title: item.title,
    authorFirstName: item.author.firstName,
    authorLastName: item.author.lastName,
    authorDateOfBirth: item.author.dateOfBirth,
    price: str(item.price),
    pages: str(item.pages),
    dueDays: str(item.dueDays),
    publishingDate: item.publishingDate,
    isbn: str(item.isbn),
    genre: str(item.genre),
    description: str(item.description),
    publicationFrequency: str(item.publicationFrequency),
    impactFactor: str(item.impactFactor),
    issueNumber: str(item.issueNumber),
    issueLanguage: str(item.issueLanguage),
  };

  return (
    <>
      <PageHeader title={`Edit ${item.title}`} description={`Item ID ${item.id}`} />
      <ItemForm initial={initial} itemId={item.id} submitLabel="Save changes" />
    </>
  );
}
