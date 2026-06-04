# Sicilia — interactive 7-day itinerary

A single-page, mobile-first travel itinerary for a 7-night self-drive trip in
southeast Sicily (10–17 August). Toggle between two arrival plans — **by plane**
(Catania) and **by car + ferry** (Messina) — and the whole day-by-day timeline
re-renders.

Static, client-side only. No backend, no database, no localStorage, no API calls.

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- `lucide-react` icons
- Fonts: Fraunces (display) + Spline Sans (body) via `next/font/google`
- Single route: `/`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
```

## Structure

```
app/
  layout.tsx          fonts + metadata
  page.tsx            renders <ItineraryClient/>
  globals.css         Tailwind + CSS vars, gradients, stagger keyframes, print
components/
  ItineraryClient.tsx "use client" root: mode toggle + timeline
  Hero.tsx            wordmark + plane/ferry tablist + plan blurb
  DayCard.tsx         collapsible day, Ferragosto banner, departure styling
  Stop.tsx            timeline rail, Via segment, gem tag
  StopImage.tsx       <img> with type-toned emoji fallback on error
lib/
  itinerary.ts        all data + types (two plans, shared mid-days)
  theme.ts            color + stop-type tokens (icon/accent/tone/emoji)
```

Location photos come from Wikimedia Commons. `StopImage` falls back to the stop
type's pale tone + emoji on load failure, so nothing ever renders broken.

## Deploy (Vercel)

Push to a Git repo and import into Vercel, or:

```bash
npx vercel
```

No environment variables required.

## Notes

- `?plan=ferry` deep-links the ferry plan on load.
- Includes a print stylesheet (`@media print`) for clean PDF export.
