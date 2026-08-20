"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

/**
 * Delete with an inline confirm step. The button label changes rather than
 * using window.confirm(), so the flow is visible and testable.
 */
export function DeleteButton({
  endpoint,
  label,
  confirmLabel = "Confirm delete",
  onDeleted,
}: {
  endpoint: string;
  label: string;
  confirmLabel?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (!armed) {
      setArmed(true);
      return;
    }

    setBusy(true);
    setError(null);
    const response = await fetch(endpoint, { method: "DELETE" });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Could not delete.");
      setBusy(false);
      setArmed(false);
      return;
    }

    onDeleted?.();
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button
        type="button"
        variant={armed ? "danger" : "secondary"}
        onClick={onClick}
        disabled={busy}
      >
        {busy ? "Deleting..." : armed ? confirmLabel : label}
      </Button>
      {error ? (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}
