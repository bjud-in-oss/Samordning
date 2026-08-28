# Steg 2c1: Arkitekturgren A (Harmonisera med bg-brand-accent)

## Förslag i Gren A: Direkt konsumtion av bg-brand-accent i PreviewCard

I `PreviewCard.tsx` ersätts referensen `bg-brand-primary` med den redan fullt etablerade klassen `bg-brand-accent`. 

### Genomförande:
```tsx
className={`px-5 py-2.5 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto ${
  !consentConfirmed 
    ? "bg-brand-ink/30 cursor-not-allowed opacity-60" 
    : "bg-brand-accent hover:bg-brand-accent/90"
}`}
```

### Fördelar:
- Inga förändringar krävs i globala stylesheet-filer.
- Samma färgtema och trygghet över alla vyer.
