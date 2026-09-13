# Steg 1a: Orientera (TCK-UI-001)

## Domän och Mål
- **Domän**: `Global` (integrationsvyer mellan skal och funktioner)
- **Ticket**: TCK-UI-001 - Koppla ihop LiveTranslationWidget med huvudgränssnittet i PWA-appen
- **Syfte**: Integrera `LiveTranslationWidget` från `@/features/live_translation` i applikationens primära layout och navigeringskontroll.

## GROW-frågor (Risknoder: State, Contract, Effects)
1. **Goal & State**: Hur ska applikationens vy-tillstånd (`currentView`) hantera övergången mellan flödet (`'stream'`), inställningar (`'settings'`) och direktöversättning (`'translation'`), och hur ska toggling tillbaka till huvudflödet ske?
2. **Reality & Contract**: Vilka prop-kontrakt krävs i `AppHeaderProps` och `MainViewContentProps` för att möjliggöra växling till `'translation'` utan att bryta befintliga gränssnitt eller skapa `any`-typläckage?
3. **Options/Will & Effects**: Hur säkerställer vi att ljudströmning och resurser i `LiveTranslationWidget` hanteras rent vid växling bort från vyn, samt att layouten följer PWA- och mobilstandarder (touch target >= 44px, designsystemets färgkoder)?
