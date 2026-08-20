"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";

type Option = { id: string; label: string };

export function BorrowForm({
  customers,
  items,
}: {
  customers: Option[];
  items: Option[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [serviceType, setServiceType] = useState<
    "none" | "printing" | "proofreading"
  >("none");
  const [costPerPage, setCostPerPage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setResult(null);

    const service =
      serviceType === "none"
        ? { type: "none" as const }
        : { type: serviceType, costPerPage };

    const response = await fetch("/api/transactions/borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, itemId, service }),
    });

    const body = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(body.error ?? "Could not record the borrow.");
      return;
    }

    setResult(body.id);
    router.refresh();
  }

  if (items.length === 0 || customers.length === 0) {
    return (
      <Alert tone="info">
        You need at least one customer and one item before recording a borrow.
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {result ? (
        <Alert tone="success">
          Transaction set successfully. Transaction ID <strong>{result}</strong> -
          keep this to return the item.
        </Alert>
      ) : null}

      <Card className="space-y-4">
        <Field label="Customer" htmlFor="customerId">
          <Select
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Item"
          htmlFor="itemId"
          hint="Items already on loan are not listed."
        >
          <Select
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          >
            {items.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">Extra service</h2>

        <Field label="Service" htmlFor="serviceType">
          <Select
            id="serviceType"
            value={serviceType}
            onChange={(e) =>
              setServiceType(e.target.value as typeof serviceType)
            }
          >
            <option value="none">None</option>
            <option value="printing">Printing</option>
            <option value="proofreading">Proofreading</option>
          </Select>
        </Field>

        {serviceType !== "none" ? (
          <Field label="Cost per page" htmlFor="costPerPage">
            <Input
              id="costPerPage"
              type="number"
              step="0.01"
              value={costPerPage}
              onChange={(e) => setCostPerPage(e.target.value)}
            />
          </Field>
        ) : null}
      </Card>

      <Button type="submit" disabled={saving}>
        {saving ? "Recording..." : "Borrow item"}
      </Button>
    </form>
  );
}
