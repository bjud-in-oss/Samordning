# Steg 3b: Domänkontrakt och Fraktal Dokumentation

- **Domänkontrakt**:
  ```typescript
  export interface StreamFilterStatusProps {
    savedTags?: {
      limitedAreas?: string[];
      primaryArea?: string;
      limitAreas?: boolean;
      enabledCategories?: string[];
      languages?: string[];
      organizations?: string[];
    } | null;
    pushEnabled?: boolean;
    onOpenSettings?: () => void;
  }
  ```
- **Visningsregler för områden**:
  - Om `!savedTags?.limitAreas` eller `savedTags?.limitedAreas?.length === 0` eller om alla områden är valda -> "Alla områden aktiva".
  - Om ett specifikt urval av områden gjorts -> Lista de valda områdena.
