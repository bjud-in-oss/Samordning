# Steg 1b: Kartlägga

- **Empirisk inventering**:
  - "Bjud in"-knappen i `src/components/AppHeader.tsx` använder `bg-brand-accent` (`#5e6c5c`).
  - Hårdkodade `emerald-*` och `green-*` färger identifierades i:
    - `src/features/skapa_inbjudan/CreateInvitationForm.tsx` (toast, consent checkbox)
    - `src/features/skapa_inbjudan/components/PreviewCard.tsx` (kortets hörn-badge, ikoner, sänd-knapp)
    - `src/features/skapa_inbjudan/components/Step1AiReview.tsx` (AI-förslagsbox, granska-knapp)
    - `src/features/skapa_inbjudan/components/Step2Privacy.tsx` (GDPR-knapp & checkbox)
    - `src/features/skapa_inbjudan/components/Step4Reconciliation.tsx` (godkänn-knappar & bekräftelse)
    - `src/features/skapa_inbjudan/components/PostSubmissionStepper.tsx` (progress bar)
    - `src/features/skapa_inbjudan/components/AiReviewModal.tsx` (godkänn-knappar)
    - `src/features/inbjudningar/components/StreamFilterStatus.tsx` (statusbadge)
    - `src/features/inbjudningar/components/AdminModerationQueue.tsx` (godkänn-knapp)
    - `src/features/inbjudningar/components/StreamNoticeCard.tsx` (hörnbadge)
    - `src/features/inbjudningar/components/AlertDetailInfoCard.tsx` (detaljikoner, länk)
    - `src/features/inbjudningar/ActiveStream.tsx` (utkastkort, granskningsstatus)
    - `src/features/sms_assistant/components/PendingAlertsQueue.tsx` (admin-notiser)
    - `src/features/sms_assistant/components/AdminConsoleHeader.tsx` (aktiv badge)
- **Mål**: Ersätta alla avvikande `emerald-*` och `green-*` element med `brand-accent` och matchande neutrala/pappersytor så att hela gränssnittet harmoniserar med "Bjud in"-knappens färg.
