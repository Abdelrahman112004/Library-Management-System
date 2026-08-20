import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api";
import { returnSchema } from "@/lib/transactions/schema";
import { returnItem, type ReturnError } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

const MESSAGES: Record<ReturnError, { message: string; status: number }> = {
  "not-found": { message: "No transaction found with that ID.", status: 404 },
  "already-returned": {
    message: "This item has already been returned.",
    status: 409,
  },
};

/** POST /api/transactions/return - feature 8. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, returnSchema);
  if (!parsed.ok) return parsed.response;

  const result = await returnItem(parsed.data.transactionId);
  if (!result.ok) {
    const { message, status } = MESSAGES[result.error];
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(result.value);
}
