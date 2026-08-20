import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library Management System",
  description:
    "Manage library items, customers, and borrow/return transactions.",
};

const NAV = [
  { href: "/items", label: "Items" },
  { href: "/customers", label: "Customers" },
  { href: "/transactions/borrow", label: "Borrow" },
  { href: "/transactions/return", label: "Return" },
  { href: "/transactions/outstanding", label: "Outstanding" },
  { href: "/authors", label: "Authors" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="bg-slate-50 text-slate-900 min-h-full flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              Library
            </Link>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
