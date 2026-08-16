# 4. Producera (Exekveringskvitto)

## Genomförda förändringar
Harmonisering av appens färgpalett: Samtliga instanser av gröna nyanser (`emerald-*` och avvikande `green-*`) har ersatts med `brand-accent` (`#5e6c5c`) och tillhörande neutrala/papperstoner (`brand-paper`, `brand-bg`, `brand-ink`) för att matcha referensknappen "Bjud in".

### Berörda filer och komponenter
1. `src/features/skapa_inbjudan/CreateInvitationForm.tsx` - Uppdaterad toast-notifikation och samtyckescheckbox till `brand-accent`.
2. `src/features/skapa_inbjudan/components/PreviewCard.tsx` - Uppdaterade ikoner, hörn-badge och Sänd-knapp till `brand-accent`.
3. `src/features/skapa_inbjudan/components/Step1AiReview.tsx` - Uppdaterad valideringsruta och framåtknapp till `brand-accent` och `brand-paper`.
4. `src/features/skapa_inbjudan/components/Step2Privacy.tsx` - Uppdaterad samtyckescheckbox och bekräfta-knapp till `brand-accent`.
5. `src/features/skapa_inbjudan/components/Step4Reconciliation.tsx` - Uppdaterad bekräftelseknapp, framgångsmeddelande och kalenderknapp till `brand-accent`.
6. `src/features/skapa_inbjudan/components/PostSubmissionStepper.tsx` - Uppdaterad förloppsindikator till `bg-brand-accent`.
7. `src/features/skapa_inbjudan/components/AiReviewModal.tsx` - Uppdaterad extraheringsrekommendationsruta till `brand-paper` och `brand-accent`.
8. `src/features/inbjudningar/components/StreamFilterStatus.tsx` - Uppdaterad badge till `brand-accent`.
9. `src/features/inbjudningar/components/AdminModerationQueue.tsx` - Uppdaterad godkänn-knapp till `brand-accent`.
10. `src/features/inbjudningar/components/StreamNoticeCard.tsx` - Uppdaterad kategoribadge till `brand-accent`.
11. `src/features/inbjudningar/components/AlertDetailInfoCard.tsx` - Uppdaterade metadataikoner och länkar till `brand-accent`.
12. `src/features/inbjudningar/ActiveStream.tsx` - Uppdaterat utkastkort för egna förslag och granskningsstatus till `brand-accent` / `brand-paper`.
13. `src/features/sms_assistant/components/PendingAlertsQueue.tsx` - Uppdaterad köetikett och godkänn-knapp till `brand-accent`.
14. `src/features/sms_assistant/components/AdminConsoleHeader.tsx` - Uppdaterad statusbadge till `brand-accent`.

## Verifiering
Samtliga komponenter har kompilerats och verifierats för typkorrekthet och visuell harmoni.
