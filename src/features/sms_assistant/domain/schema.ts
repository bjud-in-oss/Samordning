import { z } from "zod";

export const AdminDeviceTokenSchema = z.string().min(5);

export const AdminPairingStatusSchema = z.object({
  paired: z.boolean(),
});

export const AlertItemSchema = z.object({
  id: z.string(),
  category: z.string().optional(),
  area: z.string().optional(),
  time: z.string().optional(),
  scrubbedText: z.string().optional(),
  rawText: z.string().optional(),
  responsibleParty: z.string().optional(),
  status: z.string().optional(),
});

export type AlertItem = z.infer<typeof AlertItemSchema>;
