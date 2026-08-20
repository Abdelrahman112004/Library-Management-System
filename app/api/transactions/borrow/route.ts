import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api";
import { borrowSchema } from "@/lib/transactions/schema";
import { borrow, type BorrowError } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

/** The console messages the Java prints for each failure. */
const MESSAGES: Record<BorrowError, { message: string; status: number }> = {
  "customer-not-found": {
    message: "Customer not found for the given ID.",
    status: 404,
  },
  "item-not-found": { message: "Item not found for the given ID.", status: 404 },
  "already-borrowed": {
    message: "Sorry, the item is already borrowed.",
    status: 409,
  },
};

/** POST /api/transactions/borrow - feature 7. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, borrowSchema);
  if (!parsed.ok) return parsed.response;

  const result = await borrow(parsed.data);
  if (!result.ok) {
    const { message, status } = MESSAGES[result.error];
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(result.value, { status: 201 });
}
