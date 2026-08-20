import { NextResponse } from "next/server";
import { notFound, parseBody } from "@/lib/api";
import { customerSchema } from "@/lib/customers/schema";
import {
  deleteCustomer,
  findCustomerById,
  updateCustomer,
} from "@/lib/customers/service";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const customer = await findCustomerById(id);
  return customer ? NextResponse.json(customer) : notFound("Customer");
}

/** PUT /api/customers/:id - feature 5, update an existing customer. */
export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  const parsed = await parseBody(request, customerSchema);
  if (!parsed.ok) return parsed.response;

  const updated = await updateCustomer(id, parsed.data);
  return updated ? NextResponse.json(updated) : notFound("Customer");
}

/** DELETE /api/customers/:id - feature 6, delete an existing customer. */
export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;

  try {
    const deleted = await deleteCustomer(id);
    return deleted ? new NextResponse(null, { status: 204 }) : notFound("Customer");
  } catch {
    return NextResponse.json(
      { error: "This customer has transactions and cannot be deleted." },
      { status: 409 },
    );
  }
}
