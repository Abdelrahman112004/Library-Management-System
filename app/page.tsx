import Link from "next/link";
import { Card, PageHeader } from "@/components/ui";
import { listCustomers } from "@/lib/customers/service";
import { listItems } from "@/lib/items/service";
import { listTransactions } from "@/lib/transactions/service";

export const dynamic = "force-dynamic";

const FEATURES = [
  { href: "/items/new", title: "Add item", body: "Book, journal, magazine or newspaper." },
  { href: "/items", title: "View all items", body: "Browse, edit or delete any item." },
  { href: "/customers/new", title: "Add customer", body: "Register a new borrower." },
  { href: "/customers", title: "View customers", body: "Edit or remove a customer." },
  { href: "/transactions/borrow", title: "Borrow", body: "Loan an item, with an optional service." },
  { href: "/transactions/return", title: "Return", body: "Close a loan by transaction ID." },
  {
    href: "/transactions/outstanding",
    title: "Not yet returned",
    body: "What a customer still has out.",
  },
  { href: "/authors", title: "Author publications", body: "Search by author last name." },
];

export default async function HomePage() {
  const [items, customers, transactions] = await Promise.all([
    listItems(),
    listCustomers(),
    listTransactions(),
  ]);
  const onLoan = transactions.filter((t) => t.checkInDate === null).length;

  return (
    <>
      <PageHeader
        title="Library Management System"
        description="Every feature from the original Java console menu, on the web."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Items", value: items.length },
          { label: "Customers", value: customers.length },
          { label: "On loan", value: onLoan },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="text-2xl font-semibold">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group">
            <Card className="h-full transition-colors group-hover:border-slate-400">
              <div className="font-medium">{feature.title}</div>
              <div className="mt-1 text-sm text-slate-600">{feature.body}</div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
