# Steg 3b: Domänkontrakt och Fraktal Dokumentation

## Domän: `inbjudningar`

### 1. Komponenter och Gränssnitt

#### A. `src/features/inbjudningar/components/StreamFilterStatus.tsx`
- **Interface**:
```typescript
export interface SavedFilterTags {
  limitAreas?: boolean;
  limitedAreas?: string[];
  primaryArea?: string;
  enabledCategories?: string[];
  languages?: string[];
  organizations?: string[];
}

export interface StreamFilterStatusProps {
  savedTags?: SavedFilterTags | null;
  pushEnabled?: boolean;
  onOpenSettings?: () => void;
}
```

#### B. `src/features/inbjudningar/components/StreamQuoteCard.tsx`
- **Interface**:
```typescript
export interface StreamQuoteCardProps {
  className?: string;
}
```

### 2. Fraktal dokumentation
- Dokumentation uppdateras i `src/features/inbjudningar/doc/INDEX.md` och `src/features/inbjudningar/doc/UI_WORKFLOWS.md`.
