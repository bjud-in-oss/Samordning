# Steg 2a: Förändra utåt (Vision för TCK-012)

## Vision för användarupplevelse och visuell ergonomi

När administratören eller en medlem skapar en inbjudan och bockar för integritetsbekräftelsen ska åtgärdsknappen "Publicera direkt" / "Ge en inbjudan" tydligt och distinkt tändas upp med församlingens varma signaturfärg (`bg-brand-accent` eller `bg-brand-primary`). 

### Visuell målbild:
- **Inaktiverad**: Dämpad, halvtransparent grå/bläckton (`bg-brand-ink/20 text-brand-ink/50 cursor-not-allowed`) som indikerar att villkor kvarstår.
- **Aktiverad (Integritet godkänd)**: Solid grön/bärnsten/skymningston i enlighet med aktivt tema (`bg-brand-accent hover:bg-brand-accent/90 text-white shadow-sm`), med vit text och tydlig kontrast.
- **Ingen osynlighet**: Knappen förlorar aldrig sin bakgrund eller kontrast vid tillståndsövergången.
