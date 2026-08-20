import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";
import {
  Button,
  EmptyState,
  PageHeader,
  Table,
  Td,
  Th,
} from "@/components/ui";
import { ITEM_KIND_LABELS } from "@/lib/items/schema";
import { listItems } from "@/lib/items/service";

export const dynamic = "force-dynamic";

/** Feature 11: view all items. Also the entry point for update and delete. */
export default async function ItemsPage() {
  const items = await listItems();

  return (
    <>
      <PageHeader
        title="Items"
        description="Every book, journal, magazine and newspaper in the library."
        action={
          <Link href="/items/new">
            <Button>Add item</Button>
          </Link>
        }
      />

      {items.length === 0 ? (
        <EmptyState>
          No items in the library yet.{" "}
          <Link href="/items/new" className="font-medium underline">
            Add the first one
          </Link>
          .
        </EmptyState>
      ) : (
        <Table
          head={
            <tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Type</Th>
              <Th>Author</Th>
              <Th>Price</Th>
              <Th>Due days</Th>
              <Th>Actions</Th>
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
              <Td>{item.price.toFixed(2)}</Td>
              <Td>{item.dueDays}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Link href={`/items/${item.id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <DeleteButton
                    endpoint={`/api/items/${item.id}`}
                    label={`Delete ${item.title}`}
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
