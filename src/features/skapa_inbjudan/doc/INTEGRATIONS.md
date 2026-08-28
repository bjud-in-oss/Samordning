# Integrationer: skapa_inbjudan

1. **Backend Alert API (`/api/alerts`)**: Skickar nya inbjudningar för lagring i serverns databas.
2. **Lokal Lagring (`localStorage`)**: Sparar användarens favoritinställningar och utkast.
3. **Shared Utility Modules**: Använder `@shared` för geografiska distrikt och typer.
4. **Applikationsintegration**: Exporterar `CreateInvitationForm` och relaterade typer via `index.ts`.
