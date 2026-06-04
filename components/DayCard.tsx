"use client";

import { useState } from "react";
import { ChevronDown, Plane, Sun, BedDouble, TriangleAlert } from "lucide-react";
import { type Day, FERRAGOSTO_TEXT } from "@/lib/itinerary";
import { COLORS } from "@/lib/theme";
import Stop from "./Stop";

interface DayCardProps {
  day: Day;
  accent: string;
  index: number;
}

export default function DayCard({ day, accent, index }: DayCardProps) {
  const [open, setOpen] = useState(true);
  const badgeBg = day.depart ? COLORS.olive : accent;
  const panelId = `day-${day.n}-panel`;

  return (
    <article
      className="day-card rise-in overflow-hidden rounded-2xl border border-line bg-paper shadow-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 px-3 py-3 text-left sm:px-4"
      >
        {/* Square number / departure badge */}
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-white shadow-sm"
          style={{ backgroundColor: badgeBg }}
          aria-hidden="true"
        >
          {day.depart ? <Plane size={20} strokeWidth={2.2} /> : day.n}
        </span>

        <div className="min-w-0 flex-1">
          <div
            className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide"
            style={{ color: day.ferragosto ? COLORS.terra : COLORS.sub }}
          >
            {day.ferragosto && <Sun size={13} strokeWidth={2.4} />}
            <span>
              Day {day.n} · {day.date}
            </span>
          </div>
          <h3 className="truncate font-display text-[19px] font-semibold leading-tight text-ink">
            {day.title}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-sub">
            <BedDouble size={13} strokeWidth={2} aria-hidden="true" />
            <span>sleep: {day.sleep}</span>
          </div>
        </div>

        <ChevronDown
          size={20}
          strokeWidth={2.2}
          aria-hidden="true"
          className={`shrink-0 text-sub transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div id={panelId} className="px-3 pb-4 sm:px-4">
          {day.ferragosto && (
            <div
              className="mb-4 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[13px] leading-snug"
              style={{
                borderColor: "#E6C07A",
                backgroundColor: "#FBEFD2",
                color: "#8A5A1E",
              }}
            >
              <TriangleAlert
                size={16}
                strokeWidth={2.2}
                className="mt-[1px] shrink-0"
                aria-hidden="true"
              />
              <span>{FERRAGOSTO_TEXT}</span>
            </div>
          )}

          <ol className="space-y-[18px]">
            {day.stops.map((stop, i) => (
              <Stop
                key={`${stop.title}-${i}`}
                stop={stop}
                first={i === 0}
                last={i === day.stops.length - 1}
              />
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
