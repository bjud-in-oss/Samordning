# Steg 3c: Fil-operativ Källkodsspecifikation

## Fullständig fillista för Steg 4 (Domän: skapa_inbjudan)

1. **Enhetstester (TDD-fas före produktionskod)**:
   - `src/features/skapa_inbjudan/hooks/__tests__/useInvitationPublishing.test.ts`: Verifierar publiceringsflöde och sparande till datalager.
   - `src/features/skapa_inbjudan/hooks/__tests__/useInvitationForm.test.ts`: Verifierar formulärets samordning och validering.
   - `src/features/skapa_inbjudan/hooks/__tests__/useInvitationFavorites.test.ts`: Verifierar favorit- och mallhantering.
   - `src/features/skapa_inbjudan/hooks/__tests__/useInvitationDialogs.test.ts`: Verifierar modal navigering och fältval.

2. **Domänmodeller och typer**:
   - `src/features/skapa_inbjudan/domain/types.ts`: Ersätter `any` med strikta typer (`SavedUserTags`, `InvitationPublishPayload`).
   - `src/features/skapa_inbjudan/domain/geocoder.ts`: Geokodning för Göteborgsplatser med rena typade importer.
   - `src/features/skapa_inbjudan/domain/constants.ts`: Standardvärden för formulärval.

3. **Hooks och tillståndshantering**:
   - `src/features/skapa_inbjudan/hooks/subhooks/useInvitationPublishing.ts`: Typad publiceringslogik som sparar inbjudningar till datalagret.
   - `src/features/skapa_inbjudan/hooks/subhooks/useInvitationFavorites.ts`: Sparar och läser inbjudningsmallar.
   - `src/features/skapa_inbjudan/hooks/subhooks/useInvitationDialogs.ts`: Hanterar dialogtillstånd.
   - `src/features/skapa_inbjudan/hooks/useInvitationForm.ts`: Sammanhållen hook för formulärlogik.

4. **UI-komponenter och dialoger**:
   - `src/features/skapa_inbjudan/components/PostSubmissionStepper.tsx`: Stegvisare efter publicering utan direkta nätverksanrop i UI.
   - `src/features/skapa_inbjudan/components/PreviewCard.tsx`: Förhandsgranskningskort.
   - `src/features/skapa_inbjudan/components/FavoritesBar.tsx`: Favoritväljare.
   - `src/features/skapa_inbjudan/components/AiReviewModal.tsx`: Granskningsmodal för förslag.
   - `src/features/skapa_inbjudan/components/AiFlagModal.tsx`: Varningsmodal för integritet.
   - `src/features/skapa_inbjudan/components/GatewayQrModal.tsx`: QR-kodsvisare.
   - `src/features/skapa_inbjudan/components/Step1AiReview.tsx`: Steg 1 i efterflödet.
   - `src/features/skapa_inbjudan/components/Step2Privacy.tsx`: Steg 2 i efterflödet.
   - `src/features/skapa_inbjudan/components/Step3SmsShare.tsx`: Steg 3 i efterflödet.
   - `src/features/skapa_inbjudan/components/Step4Reconciliation.tsx`: Steg 4 i efterflödet.
   - `src/features/skapa_inbjudan/components/dialogs/TimeDialog.tsx`: Tidsdialog.
   - `src/features/skapa_inbjudan/components/dialogs/LocationDialog.tsx`: Platsdialog.
   - `src/features/skapa_inbjudan/components/dialogs/ActivityDialog.tsx`: Aktivitetsdialog.
   - `src/features/skapa_inbjudan/components/dialogs/AreaDialog.tsx`: Områdesdialog.
   - `src/features/skapa_inbjudan/components/dialogs/AudienceDialog.tsx`: Målgruppsdialog.
   - `src/features/skapa_inbjudan/components/dialogs/OrganizerDialog.tsx`: Arrangörsdialog.
   - `src/features/skapa_inbjudan/CreateInvitationForm.tsx`: Huvudformulär.
   - `src/features/skapa_inbjudan/index.ts`: Domänfasad.

BESLUT: GODKÄND
