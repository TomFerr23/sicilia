"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import { PLANS, FOOTER_TIPS } from "@/lib/itinerary";
import Hero from "./Hero";
import DayCard from "./DayCard";

type Mode = "plane" | "ferry";

export default function ItineraryClient() {
  const params = useSearchParams();
  const initial: Mode = params.get("plan") === "ferry" ? "ferry" : "plane";
  const [mode, setMode] = useState<Mode>(initial);

  const plan = PLANS[mode];

  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <Hero mode={mode} onSelect={setMode} plan={plan} />

      {/* Timeline. Cards are re-keyed by mode so the stagger animation
          replays whenever the plan changes. */}
      <section className="mt-7 space-y-4">
        {plan.days.map((day, i) => (
          <DayCard
            key={`${mode}-${day.n}`}
            day={day}
            accent={plan.accent}
            index={i}
          />
        ))}
      </section>

      <footer className="mt-10 rounded-2xl border border-line bg-paper/70 p-4 text-[13px] leading-relaxed text-sub shadow-card">
        <div className="mb-2 flex items-center gap-2 font-display text-[15px] font-semibold text-ink">
          <Info size={15} strokeWidth={2.2} style={{ color: plan.accent }} />
          Before you go
        </div>
        <ul className="space-y-1.5">
          {FOOTER_TIPS.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span aria-hidden="true" style={{ color: plan.accent }}>
                ·
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
