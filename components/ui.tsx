import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
} as const;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANTS;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
        "transition-colors disabled:pointer-events-none disabled:opacity-50",
        BUTTON_VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}

/**
 * Wraps a control with its label and error text. The label is tied to the
 * control with htmlFor/id so Playwright can select by label, and screen readers
 * announce the pairing.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const CONTROL =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm " +
  "focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, className)} {...props}>
      {children}
    </select>
  );
}

export function Alert({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
}) {
  const tones = {
    info: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
  } as const;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("rounded-md border px-4 py-3 text-sm", tones[tone])}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card className="text-center text-sm text-slate-600">{children}</Card>
  );
}

export function Table({
  head,
  children,
}: {
  head: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          {head}
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return <th className="px-4 py-2.5 font-medium">{children}</th>;
}

export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-2.5", className)}>{children}</td>;
}
