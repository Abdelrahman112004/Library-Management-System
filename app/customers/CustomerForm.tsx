"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import { customerSchema } from "@/lib/customers/schema";
import { fieldErrors } from "@/lib/api";

export type CustomerFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  student: boolean;
};

export const EMPTY_CUSTOMER: CustomerFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  address: "",
  phoneNumber: "",
  student: false,
};

export function CustomerForm({
  initial,
  customerId,
  submitLabel,
}: {
  initial: CustomerFormValues;
  customerId?: string;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof CustomerFormValues>(
    field: K,
    value: CustomerFormValues[K],
  ) => setValues((current) => ({ ...current, [field]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    const parsed = customerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      setSaving(false);
      return;
    }

    setErrors({});
    const response = await fetch(
      customerId ? `/api/customers/${customerId}` : "/api/customers",
      {
        method: customerId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setFormError(body.error ?? "Something went wrong. Please try again.");
      setSaving(false);
      return;
    }

    router.push("/customers");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Card className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={errors.firstName}>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </Field>
          <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Date of birth"
          htmlFor="dateOfBirth"
          error={errors.dateOfBirth}
          hint="YYYY-MM-DD"
        >
          <Input
            id="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
          />
        </Field>

        <Field label="Address" htmlFor="address" error={errors.address}>
          <Input
            id="address"
            value={values.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>

        <Field label="Phone number" htmlFor="phoneNumber" error={errors.phoneNumber}>
          <Input
            id="phoneNumber"
            value={values.phoneNumber}
            onChange={(e) => set("phoneNumber", e.target.value)}
          />
        </Field>

        <div className="flex items-center gap-2">
          <input
            id="student"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={values.student}
            onChange={(e) => set("student", e.target.checked)}
          />
          <label htmlFor="student" className="text-sm font-medium text-slate-700">
            Student
          </label>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
