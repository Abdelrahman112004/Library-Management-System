"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";
import { ITEM_KIND_LABELS, itemSchema, type ItemInput } from "@/lib/items/schema";
import { fieldErrors } from "@/lib/api";

type Kind = ItemInput["kind"];

export type ItemFormValues = {
  kind: Kind;
  title: string;
  authorFirstName: string;
  authorLastName: string;
  authorDateOfBirth: string;
  price: string;
  pages: string;
  dueDays: string;
  publishingDate: string;
  isbn: string;
  genre: string;
  description: string;
  publicationFrequency: string;
  impactFactor: string;
  issueNumber: string;
  issueLanguage: string;
};

export const EMPTY_ITEM: ItemFormValues = {
  kind: "book",
  title: "",
  authorFirstName: "",
  authorLastName: "",
  authorDateOfBirth: "",
  price: "",
  pages: "",
  dueDays: "",
  publishingDate: "",
  isbn: "",
  genre: "",
  description: "",
  publicationFrequency: "",
  impactFactor: "",
  issueNumber: "",
  issueLanguage: "",
};

/** Shapes the flat form state into the discriminated union the schema expects. */
function toPayload(values: ItemFormValues) {
  const base = {
    title: values.title,
    author: {
      firstName: values.authorFirstName,
      lastName: values.authorLastName,
      dateOfBirth: values.authorDateOfBirth,
    },
    price: values.price,
    pages: values.pages,
    dueDays: values.dueDays,
    publishingDate: values.publishingDate,
  };

  switch (values.kind) {
    case "book":
      return {
        ...base,
        kind: "book",
        isbn: values.isbn,
        genre: values.genre,
        description: values.description,
      };
    case "journal":
      return {
        ...base,
        kind: "journal",
        publicationFrequency: values.publicationFrequency,
        impactFactor: values.impactFactor,
      };
    case "magazine":
      return { ...base, kind: "magazine", issueNumber: values.issueNumber };
    case "newspaper":
      return { ...base, kind: "newspaper", issueLanguage: values.issueLanguage };
  }
}

/** Maps a schema path back to the flat form field it came from. */
const PATH_TO_FIELD: Record<string, keyof ItemFormValues> = {
  "author.firstName": "authorFirstName",
  "author.lastName": "authorLastName",
  "author.dateOfBirth": "authorDateOfBirth",
};

export function ItemForm({
  initial,
  itemId,
  submitLabel,
}: {
  initial: ItemFormValues;
  itemId?: number;
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ItemFormValues) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const errorFor = (field: keyof ItemFormValues) => errors[field];

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    // Validate with the same schema the API uses, so the user sees problems
    // before a round trip.
    const parsed = itemSchema.safeParse(toPayload(values));
    if (!parsed.success) {
      const raw = fieldErrors(parsed.error.issues);
      const mapped: Record<string, string> = {};
      for (const [path, message] of Object.entries(raw)) {
        mapped[PATH_TO_FIELD[path] ?? path] = message;
      }
      setErrors(mapped);
      setSaving(false);
      return;
    }

    setErrors({});
    const response = await fetch(
      itemId ? `/api/items/${itemId}` : "/api/items",
      {
        method: itemId ? "PUT" : "POST",
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

    router.push("/items");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError ? <Alert tone="error">{formError}</Alert> : null}

      <Card className="space-y-4">
        <Field label="Item type" htmlFor="kind">
          <Select
            id="kind"
            value={values.kind}
            onChange={(e) => set("kind")(e.target.value)}
          >
            {Object.entries(ITEM_KIND_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Title" htmlFor="title" error={errorFor("title")}>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => set("title")(e.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Author first name"
            htmlFor="authorFirstName"
            error={errorFor("authorFirstName")}
          >
            <Input
              id="authorFirstName"
              value={values.authorFirstName}
              onChange={(e) => set("authorFirstName")(e.target.value)}
            />
          </Field>
          <Field
            label="Author last name"
            htmlFor="authorLastName"
            error={errorFor("authorLastName")}
          >
            <Input
              id="authorLastName"
              value={values.authorLastName}
              onChange={(e) => set("authorLastName")(e.target.value)}
            />
          </Field>
          <Field
            label="Author date of birth"
            htmlFor="authorDateOfBirth"
            error={errorFor("authorDateOfBirth")}
            hint="YYYY-MM-DD"
          >
            <Input
              id="authorDateOfBirth"
              type="date"
              value={values.authorDateOfBirth}
              onChange={(e) => set("authorDateOfBirth")(e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Price" htmlFor="price" error={errorFor("price")}>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={values.price}
              onChange={(e) => set("price")(e.target.value)}
            />
          </Field>
          <Field label="Pages" htmlFor="pages" error={errorFor("pages")}>
            <Input
              id="pages"
              type="number"
              value={values.pages}
              onChange={(e) => set("pages")(e.target.value)}
            />
          </Field>
          <Field label="Due days" htmlFor="dueDays" error={errorFor("dueDays")}>
            <Input
              id="dueDays"
              type="number"
              value={values.dueDays}
              onChange={(e) => set("dueDays")(e.target.value)}
            />
          </Field>
          <Field
            label="Publishing date"
            htmlFor="publishingDate"
            error={errorFor("publishingDate")}
          >
            <Input
              id="publishingDate"
              type="date"
              value={values.publishingDate}
              onChange={(e) => set("publishingDate")(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">
          {ITEM_KIND_LABELS[values.kind]} details
        </h2>

        {values.kind === "book" ? (
          <div className="space-y-4">
            <Field label="ISBN" htmlFor="isbn" error={errorFor("isbn")}>
              <Input
                id="isbn"
                value={values.isbn}
                onChange={(e) => set("isbn")(e.target.value)}
              />
            </Field>
            <Field label="Genre" htmlFor="genre" error={errorFor("genre")}>
              <Input
                id="genre"
                value={values.genre}
                onChange={(e) => set("genre")(e.target.value)}
              />
            </Field>
            <Field
              label="Description"
              htmlFor="description"
              error={errorFor("description")}
            >
              <Input
                id="description"
                value={values.description}
                onChange={(e) => set("description")(e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {values.kind === "journal" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Publication frequency"
              htmlFor="publicationFrequency"
              error={errorFor("publicationFrequency")}
            >
              <Input
                id="publicationFrequency"
                value={values.publicationFrequency}
                onChange={(e) => set("publicationFrequency")(e.target.value)}
              />
            </Field>
            <Field
              label="Impact factor"
              htmlFor="impactFactor"
              error={errorFor("impactFactor")}
            >
              <Input
                id="impactFactor"
                type="number"
                step="0.01"
                value={values.impactFactor}
                onChange={(e) => set("impactFactor")(e.target.value)}
              />
            </Field>
          </div>
        ) : null}

        {values.kind === "magazine" ? (
          <Field
            label="Issue number"
            htmlFor="issueNumber"
            error={errorFor("issueNumber")}
          >
            <Input
              id="issueNumber"
              type="number"
              value={values.issueNumber}
              onChange={(e) => set("issueNumber")(e.target.value)}
            />
          </Field>
        ) : null}

        {values.kind === "newspaper" ? (
          <Field
            label="Issue language"
            htmlFor="issueLanguage"
            error={errorFor("issueLanguage")}
          >
            <Input
              id="issueLanguage"
              value={values.issueLanguage}
              onChange={(e) => set("issueLanguage")(e.target.value)}
            />
          </Field>
        ) : null}
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
