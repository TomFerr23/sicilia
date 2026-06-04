import { Plane, Ship, Route, MapPin } from "lucide-react";
import { PLANS, type Plan } from "@/lib/itinerary";
import { COLORS } from "@/lib/theme";

type Mode = "plane" | "ferry";

interface HeroProps {
  mode: Mode;
  onSelect: (mode: Mode) => void;
  plan: Plan;
}

const TOGGLE: { key: Mode; Icon: typeof Plane }[] = [
  { key: "plane", Icon: Plane },
  { key: "ferry", Icon: Ship },
];

export default function Hero({ mode, onSelect, plan }: HeroProps) {
  return (
    <header className="pt-10 sm:pt-14">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-sub">
        <MapPin size={13} strokeWidth={2.4} />
        <span>Southeast Sicily · 10–17 August · 7 nights</span>
      </div>

      <h1 className="wordmark font-display">SICILIA</h1>

      <p className="mt-1 max-w-xl font-display text-lg italic text-sub">
        A self-drive loop through baroque towns, wild coves and the slopes of
        Etna — your way in, your call.
      </p>

      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="Choose how you arrive in Sicily"
        className="no-print mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
      >
        {TOGGLE.map(({ key, Icon }) => {
          const p = PLANS[key];
          const active = mode === key;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onSelect(key)}
              className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200"
              style={{
                backgroundColor: active ? p.accent : COLORS.paper,
                borderColor: active ? p.accent : COLORS.line,
                color: active ? "#fff" : COLORS.ink,
                boxShadow: active
                  ? "0 8px 22px -10px rgba(22,54,95,0.55)"
                  : "none",
              }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: active
                    ? "rgba(255,255,255,0.18)"
                    : p.accent,
                  color: "#fff",
                }}
              >
                <Icon size={18} strokeWidth={2.2} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[16px] font-semibold leading-tight">
                  {p.label}
                </span>
                <span
                  className="block text-[12.5px] leading-tight"
                  style={{ color: active ? "rgba(255,255,255,0.85)" : COLORS.sub }}
                >
                  {p.sub}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active plan blurb + driving total */}
      <div className="mt-5 rounded-2xl border border-line bg-paper/70 p-4 shadow-card">
        <p className="text-[14px] leading-relaxed text-ink/90">{plan.blurb}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[13px] font-semibold text-sub">
          <Route size={15} strokeWidth={2.2} style={{ color: plan.accent }} />
          <span>Driving: {plan.drivingTotal}</span>
        </div>
      </div>
    </header>
  );
}
