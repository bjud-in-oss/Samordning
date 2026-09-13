# Steg 3b: Domänkontrakt och fraktal dokumentation

## Typkontrakt och Signaturer

### AppHeaderProps
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

### MainViewContentProps
```typescript
interface MainViewContentProps {
  activeAlertId: string | null;
  navigateTo: (path: string) => void;
  uiLanguage: UiLanguage;
  currentView: 'stream' | 'settings' | 'translation';
  setCurrentView: React.Dispatch<React.SetStateAction<'stream' | 'settings' | 'translation'>>;
  activeTab: "stream" | "create";
  setActiveTab: React.Dispatch<React.SetStateAction<"stream" | "create">>;
  handleSaveTags: (tags: unknown) => void;
  savedTags: unknown;
  pushEnabled: boolean;
  handleEnablePush: () => void;
  handleDisablePush: () => void;
  handleStreamCountChange: (filtered: number, total: number) => void;
  isAdmin: boolean;
}
```
