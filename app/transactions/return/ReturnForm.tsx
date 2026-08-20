"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";

/** Feature 8: return a transaction by its ID. */
export function ReturnForm() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/transactions/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });

    const body = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(body.error ?? "Could not return the item.");
      return;
    }

    setSuccess(`Item returned successfully on ${body.checkInDate}.`);
    setTransactionId("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <Card>
        <Field
          label="Transaction ID"
          htmlFor="transactionId"
          hint="Shown when the item was borrowed, e.g. 1000."
        >
          <Input
            id="transactionId"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </Field>
      </Card>

      <Button type="submit" disabled={saving || transactionId.trim() === ""}>
        {saving ? "Returning..." : "Return item"}
      </Button>
    </form>
  );
}
