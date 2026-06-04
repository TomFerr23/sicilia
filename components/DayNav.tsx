"use client";

import { useEffect, useRef, useState } from "react";
import { type Day } from "@/lib/itinerary";
import { COLORS } from "@/lib/theme";

interface DayNavProps {
  days: Day[];
  accent: string;
}

/**
 * Sticky horizontal strip of day chips. Tapping one scrolls to that day;
 * the active chip tracks the day currently in view via IntersectionObserver.
 */
export default function DayNav({ days, accent }: DayNavProps) {
  const [active, setActive] = useState<number>(days[0]?.n ?? 1);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sections = days
      .map((d) => document.getElementById(`day-${d.n}`))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const n = Number(visible[0].target.id.replace("day-", ""));
          if (!Number.isNaN(n)) setActive(n);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [days]);

  // Keep the active chip scrolled into view within the strip.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const chip = strip.querySelector<HTMLElement>(`[data-day="${active}"]`);
    chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  function jump(n: number) {
    document
      .getElementById(`day-${n}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Jump to a day"
      className="no-print sticky top-0 z-[1200] -mx-4 mb-5 border-b border-line bg-cream/85 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6"
    >
      <div
        ref={stripRef}
        className="no-scrollbar flex gap-1.5 overflow-x-auto"
      >
        {days.map((d) => {
          const isActive = d.n === active;
          // date is "Sun 10 Aug" → keep "Sun 10"
          const short = d.date.split(" ").slice(0, 2).join(" ");
          return (
            <button
              key={d.n}
              type="button"
              data-day={d.n}
              onClick={() => jump(d.n)}
              aria-current={isActive ? "true" : undefined}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors"
              style={{
                backgroundColor: isActive ? accent : COLORS.paper,
                borderColor: isActive ? accent : COLORS.line,
                color: isActive ? "#fff" : COLORS.sub,
              }}
            >
              <span
                className="tabular flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.22)" : COLORS.cream,
                  color: isActive ? "#fff" : COLORS.ink,
                }}
              >
                {d.n}
              </span>
              <span className="tabular whitespace-nowrap">{short}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
