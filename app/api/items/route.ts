import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api";
import { itemSchema } from "@/lib/items/schema";
import {
  createItem,
  findItemByTitle,
  findItemsByAuthorLastName,
  listItems,
} from "@/lib/items/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/items
 *   ?title=...           feature 2/3, search by title
 *   ?authorLastName=...  feature 10, publications by author
 *   (no query)           feature 11, all items
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title");
  if (title) {
    const item = await findItemByTitle(title);
    return NextResponse.json(item ? [item] : []);
  }

  const authorLastName = searchParams.get("authorLastName");
  if (authorLastName) {
    return NextResponse.json(await findItemsByAuthorLastName(authorLastName));
  }

  return NextResponse.json(await listItems());
}

/** POST /api/items - feature 1, add a new item. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, itemSchema);
  if (!parsed.ok) return parsed.response;

  const item = await createItem(parsed.data);
  return NextResponse.json(item, { status: 201 });
}
