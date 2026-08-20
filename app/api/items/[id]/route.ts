import { NextResponse } from "next/server";
import { notFound, parseBody } from "@/lib/api";
import { itemSchema } from "@/lib/items/schema";
import { deleteItem, findItemById, updateItem } from "@/lib/items/service";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

async function itemId(context: Context) {
  const { id } = await context.params;
  const parsed = Number(id);
  return Number.isInteger(parsed) ? parsed : null;
}

export async function GET(_request: Request, context: Context) {
  const id = await itemId(context);
  if (id === null) return notFound("Item");

  const item = await findItemById(id);
  return item ? NextResponse.json(item) : notFound("Item");
}

/** PUT /api/items/:id - feature 2, update an existing item. */
export async function PUT(request: Request, context: Context) {
  const id = await itemId(context);
  if (id === null) return notFound("Item");

  const parsed = await parseBody(request, itemSchema);
  if (!parsed.ok) return parsed.response;

  const updated = await updateItem(id, parsed.data);
  return updated ? NextResponse.json(updated) : notFound("Item");
}

/** DELETE /api/items/:id - feature 3, delete an existing item. */
export async function DELETE(_request: Request, context: Context) {
  const id = await itemId(context);
  if (id === null) return notFound("Item");

  // A borrowed item is referenced by a transaction; the foreign key is
  // ON DELETE RESTRICT, so report that rather than surfacing a database error.
  try {
    const deleted = await deleteItem(id);
    return deleted ? new NextResponse(null, { status: 204 }) : notFound("Item");
  } catch {
    return NextResponse.json(
      { error: "This item has transactions and cannot be deleted." },
      { status: 409 },
    );
  }
}
