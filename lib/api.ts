import { NextResponse } from "next/server";
import type { ZodType } from "zod";

/** Turns a Zod failure into { field: message }, which the forms render inline. */
export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.join(".") || "form";
    errors[key] ??= issue.message;
  }
  return errors;
}

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Validation failed", fields: fieldErrors(parsed.error.issues) },
        { status: 400 },
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

export const notFound = (what: string) =>
  NextResponse.json({ error: `${what} not found` }, { status: 404 });
