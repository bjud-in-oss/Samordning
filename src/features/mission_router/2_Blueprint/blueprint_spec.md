# 1_Scan
- **Vit skärm (React-krasch)**: Felet (`TS2304: Cannot find name 'isInline'`) uppstod för att prop:en `isInline` deklarerats i `Step1GeographyProps` men glömts i komponentens destructuring. Det kraschar bygget.
- **Notis-switch (`App.tsx`)**: Texten förminskades för mycket på mobiler. Anpassa-knappens marginaler behövde slimmas (enbart kugghjulet bör döljas via CSS).
- **Global Admin-ikon**: Enligt de nya instruktionerna utelämnas ikonen i sidhuvudet. Istället flyttas admin-åtkomsten till sidfoten, inbäddad som en extremt diskret länk i `<Disclaimer />`.

# 2_Blueprint
- **`Step1Geography.tsx`**: La till `isInline` i funktionens destructuring.
- **`App.tsx`**:
  - Införde ett nytt React-state: `const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('isAdmin') === 'true');`.
  - Införde metoden `handleAdminAuth` med webbläsarens inbyggda `prompt()`. Om koden är `utby2026` loggas användaren in.
  - Skickar prop:en `isAdmin={isAdmin}` ned till båda instanserna av `<ActiveStream />`.
  - Återställde notis-switchens textstorlek till `text-[15px] sm:text-base` och tightade upp layoutens padding.
- **`Disclaimer.tsx`**:
  - Mottar en ny prop: `onAdminTrigger?: () => void`.
  - Renderar textlänken "Admin" längst ner med extremt diskreta klasser (`opacity-30`, `hover:opacity-100`, `text-[10px]`, `uppercase`, `tracking-wider`).
- **`ActiveStream.tsx`**:
  - Accepterar en ny prop: `isAdmin?: boolean` för framtida bruk och admin-hantering per inbjudan.

# 3_Council_Impact
Ändringarna uppfyller Typescript-kontraktet och de korrigerade layoutkraven för mobiler. Admin-flödet är nu mycket mer osynligt för den vanliga användaren och håller gränssnittet rent.
