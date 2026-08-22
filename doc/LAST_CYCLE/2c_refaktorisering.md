# Steg 2c: Refaktorisering och Rensning

## 1. Rensning av Passiv UI-kod
- Radera den gamla passiva `<div>`-boxen med texten `"Slå på 'Ta emot inbjudningar' i toppfältet för att aktivera dina val."`.
- Avlägsna ikonen `<Sparkles size={24} className="text-brand-accent" />` från rubriken.

## 2. Aktiv Aktiveringsknapp
- Skapa en dedikerad, responsiv knapp längst upp i panelen när `!pushEnabled`.
- Knappen utformas med `bg-brand-accent text-white hover:bg-brand-accent/90 rounded-2xl p-4 text-xs sm:text-sm font-sans font-medium flex items-center justify-between shadow-xs transition-all cursor-pointer group` och en tydlig handlingspil (`ArrowRight`).
