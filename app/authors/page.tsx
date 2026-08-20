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
import { ITEM_KIND_LABELS } from "@/lib/items/schema";
import { findItemsByAuthorLastName, type ItemWithAuthor } from "@/lib/items/service";

export const dynamic = "force-dynamic";

/** The subtype detail the Java printed for each kind. */
function details(item: ItemWithAuthor) {
  switch (item.kind) {
    case "book":
      return `ISBN ${item.isbn} - ${item.genre}`;
    case "journal":
      return `${item.publicationFrequency} - impact factor ${item.impactFactor}`;
    case "magazine":
      return `Issue ${item.issueNumber}`;
    case "newspaper":
      return item.issueLanguage ?? "";
  }
}

/** Feature 10: all publications by an author, searched by last name. */
export default async function AuthorsPage({
  searchParams,
}: {
  searchParams: Promise<{ lastName?: string }>;
}) {
  const { lastName } = await searchParams;
  const searched = lastName?.trim() ?? "";
  const items = searched ? await findItemsByAuthorLastName(searched) : [];

  return (
    <>
      <PageHeader
        title="Author publications"
        description="Search by an author's last name to list everything they published."
      />

      <div className="space-y-6">
        <Card>
          <form method="GET" className="flex flex-wrap items-end gap-3">
            <div className="min-w-[16rem] flex-1">
              <Field label="Author last name" htmlFor="lastName">
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={searched}
                  placeholder="Smith"
                />
              </Field>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </Card>

        {searched && items.length === 0 ? (
          <Alert tone="info">No publications found for &quot;{searched}&quot;.</Alert>
        ) : null}

        {items.length > 0 ? (
          <Table
            head={
              <tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Type</Th>
                <Th>Author</Th>
                <Th>Details</Th>
              </tr>
            }
          >
            {items.map((item) => (
              <tr key={item.id}>
                <Td className="text-slate-500">{item.id}</Td>
                <Td className="font-medium">{item.title}</Td>
                <Td>{ITEM_KIND_LABELS[item.kind]}</Td>
                <Td>
                  {item.author.firstName} {item.author.lastName}
                </Td>
                <Td>{details(item)}</Td>
              </tr>
            ))}
          </Table>
        ) : null}
      </div>
    </>
  );
}
