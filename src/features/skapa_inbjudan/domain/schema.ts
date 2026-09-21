// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/domain/schema.ts] - Executable Zod Schemas
import { z } from "zod";

export const ActiveDialogTypeSchema = z.enum([
  "time",
  "location",
  "activity",
  "area",
  "audience",
  "organization"
]).nullable();

export type ActiveDialogType = z.infer<typeof ActiveDialogTypeSchema>;

export const AiReviewProposalSchema = z.object({
  missingFields: z.array(z.string()),
  extractedFromText: z.object({
    time: z.string().optional(),
    location: z.string().optional()
  }).optional(),
  organizerNotice: z.string().optional(),
  reasonCopy: z.string().optional(),
  hasPrivacyFlag: z.boolean().optional()
});

export type AiReviewProposal = z.infer<typeof AiReviewProposalSchema>;

export const FavoriteItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  time: z.string(),
  location: z.string(),
  areas: z.array(z.string()),
  audience: z.array(z.string()),
  organization: z.string(),
  organizerName: z.string(),
  activity: z.string(),
  isRecurring: z.boolean(),
  reminderTime: z.string()
});

export type FavoriteItem = z.infer<typeof FavoriteItemSchema>;

export const InvitationFormDataSchema = z.object({
  selectedTime: z.string().min(1, "Tid krävs"),
  locationName: z.string().min(1, "Plats krävs"),
  selectedAreas: z.array(z.string()),
  selectedAudience: z.array(z.string()).min(1, "Minst en målgrupp krävs"),
  activityText: z.string().min(1, "Aktivitet krävs"),
  selectedOrganization: z.string().min(1, "Organisation krävs"),
  organizerPersonName: z.string().optional(),
  isRecurring: z.boolean().default(false),
  hasReminder: z.boolean().default(false),
  reminderTime: z.string().default("1 timme innan"),
  consentConfirmed: z.boolean().refine((val) => val === true, "Samtycke krävs")
});

export type InvitationFormData = z.infer<typeof InvitationFormDataSchema>;
