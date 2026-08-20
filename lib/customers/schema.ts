import { z } from "zod";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Not a real date");

export const customerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dateOfBirth: isoDate,
  address: z.string().trim().min(1, "Address is required"),
  phoneNumber: z.string().trim().min(1, "Phone number is required"),
  // Java reads free text and treats only "yes" (case-insensitive) as true.
  // The UI uses a checkbox, so this is already a boolean by the time it
  // reaches the schema.
  student: z.coerce.boolean().default(false),
});

export type CustomerInput = z.infer<typeof customerSchema>;
