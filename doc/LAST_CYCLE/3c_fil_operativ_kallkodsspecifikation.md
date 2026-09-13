# Steg 3c: Fil-operativ Källkodsspecifikation

## Ändringsöversikt och Manifest
Denna cykel (TCK-UI-001) utförs under domänen `Global` / `core` och knyter ihop `LiveTranslationWidget` med PWA-applikationens huvudvyer.

Följande filer är specificerade för modifiering och tillägg i Fas 2 (Steg 4):
1. `src/components/AppHeader.tsx`
2. `src/components/MainViewContent.tsx`
3. `src/App.tsx`
4. `src/components/__tests__/AppHeader.test.tsx`

---

## Detaljerad filspecifikation

### 1. `src/components/AppHeader.tsx`
- **Imports**: Lägg till `Headphones` från `lucide-react`.
- **Props-interface**:
  ```typescript
  interface AppHeaderProps {
    currentView: "stream" | "settings" | "translation";
    onToggleSettings: () => void;
    onToggleTranslation: () => void;
    pushEnabled: boolean;
    isToggling: boolean;
    onTogglePush: () => void;
    onCreateInvitation: () => void;
  }
  ```
- **JSX**: I den högra samlade styrpanelen (`flex items-center gap-2 shrink-0`), placera hörlursknappen före inställningskugghjulet:
  ```tsx
  {/* Hörlursknapp för direktöversättning */}
  <button
    type="button"
    onClick={onToggleTranslation}
    className={`p-1.5 text-brand-ink/70 hover:text-brand-ink hover:bg-brand-paper rounded-xl transition-all cursor-pointer ${
      currentView === 'translation' ? 'bg-brand-paper text-brand-accent' : ''
    }`}
    title="Direktöversättning"
    aria-label="Direktöversättning"
  >
    <Headphones size={18} />
  </button>
  ```

---

### 2. `src/components/MainViewContent.tsx`
- **Imports**: Lägg till import av `LiveTranslationWidget`:
  ```typescript
  import { LiveTranslationWidget } from "../features/live_translation";
  ```
- **Props-interface**:
  ```typescript
  interface MainViewContentProps {
    activeAlertId: string | null;
    navigateTo: (path: string) => void;
    uiLanguage: UiLanguage;
    currentView: 'stream' | 'settings' | 'translation';
    setCurrentView: React.Dispatch<React.SetStateAction<'stream' | 'settings' | 'translation'>>;
    activeTab: "stream" | "create";
    setActiveTab: React.Dispatch<React.SetStateAction<"stream" | "create">>;
    handleSaveTags: (tags: any) => void;
    savedTags: any;
    pushEnabled: boolean;
    handleEnablePush: () => void;
    handleDisablePush: () => void;
    handleStreamCountChange: (filtered: number, total: number) => void;
    isAdmin: boolean;
  }
  ```
- **JSX**: När `currentView === 'translation'` renderas widgeten:
  ```tsx
  {currentView === 'translation' && (
    <div className="w-full">
      <LiveTranslationWidget />
    </div>
  )}
  ```

---

### 3. `src/App.tsx`
- **State**:
  ```typescript
  const [currentView, setCurrentView] = useState<'stream' | 'settings' | 'translation' | 'admin'>('stream');
  ```
- **AppHeader-anrop**:
  ```tsx
  <AppHeader
    currentView={currentView === 'admin' ? 'stream' : currentView}
    onToggleSettings={() => setCurrentView(prev => prev === 'settings' ? 'stream' : 'settings')}
    onToggleTranslation={() => setCurrentView(prev => prev === 'translation' ? 'stream' : 'translation')}
    pushEnabled={pushEnabled}
    isToggling={isToggling}
    onTogglePush={...}
    onCreateInvitation={...}
  />
  ```
- **MainViewContent-anrop**:
  ```tsx
  <MainViewContent
    ...
    currentView={currentView === 'admin' ? 'stream' : currentView}
    setCurrentView={setCurrentView as any}
    ...
  />
  ```

---

### 4. `src/components/__tests__/AppHeader.test.tsx`
- Enhetstest med Vitest och React Testing Library.
- Verifierar att:
  - `Headphones`-knappen renderas.
  - Klick på knappen anropar `onToggleTranslation`.
  - Aktiv vy `'translation'` applicerar markeringsstil.
