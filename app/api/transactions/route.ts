import { NextResponse } from "next/server";
import { listOutstandingForCustomer, listTransactions } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

/**
 * GET /api/transactions
 *   ?outstandingFor=<customerId>  feature 9, items not yet returned
 *   (no query)                    every transaction
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const customerId = searchParams.get("outstandingFor");
  if (customerId) {
    return NextResponse.json(await listOutstandingForCustomer(customerId));
  }

  return NextResponse.json(await listTransactions());
}
