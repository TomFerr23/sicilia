"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Info, Map as MapIcon, CalendarDays } from "lucide-react";
import { PLANS, FOOTER_TIPS } from "@/lib/itinerary";
import Hero from "./Hero";
import DayNav from "./DayNav";
import DayCard from "./DayCard";

// Leaflet touches `window`, so the map is client-only.
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-line bg-paper text-sm text-sub shadow-card sm:h-[360px]">
      Loading map…
    </div>
  ),
});

type Mode = "plane" | "ferry";

function Eyebrow({
  icon: Icon,
  children,
  accent,
}: {
  icon: typeof MapIcon;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: accent }}
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <h2 className="font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-ink">
        {children}
      </h2>
    </div>
  );
}

export default function ItineraryClient() {
  const params = useSearchParams();
  const initial: Mode = params.get("plan") === "ferry" ? "ferry" : "plane";
  const [mode, setMode] = useState<Mode>(initial);

  const plan = PLANS[mode];

  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <Hero mode={mode} onSelect={setMode} plan={plan} />

      {/* Route overview */}
      <section className="mt-9" aria-label="Route map">
        <Eyebrow icon={MapIcon} accent={plan.accent}>
          The route
        </Eyebrow>
        <RouteMap plan={plan} />
      </section>

      {/* Sticky day jump-nav */}
      <DayNav days={plan.days} accent={plan.accent} />

      {/* Timeline */}
      <section aria-label="Day by day">
        <Eyebrow icon={CalendarDays} accent={plan.accent}>
          Day by day
        </Eyebrow>
        {/* Cards re-key by mode so the stagger animation replays on switch. */}
        <div className="space-y-4">
          {plan.days.map((day, i) => (
            <div key={`${mode}-${day.n}`} id={`day-${day.n}`} className="day-anchor">
              <DayCard day={day} accent={plan.accent} index={i} />
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 rounded-2xl border border-line bg-paper/70 p-4 text-[13px] leading-relaxed text-sub shadow-card">
        <div className="mb-2 flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
          <Info size={15} strokeWidth={2.2} style={{ color: plan.accent }} />
          Before you go
        </div>
        <ul className="space-y-1.5">
          {FOOTER_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: plan.accent }}
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </footer>

      <p className="mt-6 text-center text-[11px] text-sub/80">
        Photos · Wikimedia Commons. Map · OpenStreetMap & CARTO.
      </p>
    </main>
  );
}
