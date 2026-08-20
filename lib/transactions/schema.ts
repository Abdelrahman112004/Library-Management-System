import { z } from "zod";

/**
 * Java: setservice() asks "printing or proofreading" - one or the other, never
 * both, and each carries a cost per page. Modelled as a tagged union so an
 * impossible combination cannot be represented.
 */
export const serviceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("none") }),
  z.object({
    type: z.literal("printing"),
    costPerPage: z.coerce.number().finite("Cost per page must be a number"),
  }),
  z.object({
    type: z.literal("proofreading"),
    costPerPage: z.coerce.number().finite("Cost per page must be a number"),
  }),
]);

export const borrowSchema = z.object({
  customerId: z.string().trim().min(1, "Select a customer"),
  itemId: z.coerce.number().int("Select an item"),
  service: serviceSchema.default({ type: "none" }),
});

export const returnSchema = z.object({
  transactionId: z.string().trim().min(1, "Transaction ID is required"),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
export type BorrowInput = z.infer<typeof borrowSchema>;
export type ReturnInput = z.infer<typeof returnSchema>;
