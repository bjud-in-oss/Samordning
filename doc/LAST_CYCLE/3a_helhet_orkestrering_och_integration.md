# Steg 3a: Helhet, orkestrering och integration

## Komponentkedja och Dataflöde
1. **App.tsx**:
   - Tillstånd: `const [currentView, setCurrentView] = useState<'stream' | 'settings' | 'translation' | 'admin'>('stream');`
   - Skickar `currentView={currentView === 'admin' ? 'stream' : currentView}` till `AppHeader` och `MainViewContent`.
   - Skickar `onToggleTranslation={() => setCurrentView(prev => prev === 'translation' ? 'stream' : 'translation')}` till `AppHeader`.
2. **AppHeader.tsx**:
   - Renderar `Headphones` bredvid `Settings`.
   - Triggar `onToggleTranslation`.
3. **MainViewContent.tsx**:
   - Tar emot `currentView: 'stream' | 'settings' | 'translation'`.
   - Renderar `LiveTranslationWidget` när `currentView === 'translation'`.
