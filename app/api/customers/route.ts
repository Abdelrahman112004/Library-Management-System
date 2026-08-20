import { NextResponse } from "next/server";
import { parseBody } from "@/lib/api";
import { customerSchema } from "@/lib/customers/schema";
import { createCustomer, listCustomers } from "@/lib/customers/service";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listCustomers());
}

/** POST /api/customers - feature 4, add a new customer. */
export async function POST(request: Request) {
  const parsed = await parseBody(request, customerSchema);
  if (!parsed.ok) return parsed.response;

  const customer = await createCustomer(parsed.data);
  return NextResponse.json(customer, { status: 201 });
}
