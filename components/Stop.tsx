import { Car, Sparkles } from "lucide-react";
import { type Stop as StopData } from "@/lib/itinerary";
import { TYPE_TOKENS, COLORS } from "@/lib/theme";
import StopImage from "./StopImage";

interface StopProps {
  stop: StopData;
  first: boolean;
  last: boolean;
}

const TRANSIT_TYPES = new Set(["air", "sea"]);

export default function Stop({ stop, first, last }: StopProps) {
  const token = TYPE_TOKENS[stop.type];
  const Icon = token.icon;
  const isTransit = TRANSIT_TYPES.has(stop.type);

  return (
    <li className="relative pl-9">
      {/* Vertical rail */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-[13px] top-7 bottom-[-18px] w-px"
          style={{ backgroundColor: COLORS.line }}
        />
      )}

      {/* Via segment: how you travel TO this stop. Not shown on first stop. */}
      {!first && stop.via && (
        <div className="mb-3 flex items-center gap-2 pl-1 text-[12px] text-sub">
          <span
            aria-hidden="true"
            className="ml-[-4px] flex h-5 w-5 items-center justify-center"
          >
            <Car size={13} strokeWidth={2} />
          </span>
          <span className="tabular">
            {stop.via.dur} · {stop.via.dist}
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1 border-t border-dashed"
            style={{ borderColor: COLORS.line }}
          />
        </div>
      )}

      {/* Type dot */}
      <span
        className="absolute left-0 top-0 flex h-[27px] w-[27px] items-center justify-center rounded-full text-white shadow-sm"
        style={{ backgroundColor: token.accent }}
        aria-hidden="true"
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>

      {/* Stop card */}
      <div
        className={`flex gap-3 rounded-xl border p-3 ${
          isTransit ? "border-dashed bg-transparent" : "border-line bg-paper"
        }`}
        style={
          isTransit ? { borderColor: COLORS.line } : undefined
        }
      >
        {!isTransit && (
          <StopImage
            img={stop.img}
            type={stop.type}
            alt={stop.title}
            className="h-[72px] w-[72px] sm:h-[86px] sm:w-[86px]"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="tabular text-[13px] font-semibold"
              style={{ color: COLORS.sea }}
            >
              {stop.time}
            </span>
            {stop.gem && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10.5px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: COLORS.gold }}
              >
                <Sparkles size={10} strokeWidth={2.5} />
                hidden gem
              </span>
            )}
          </div>

          <h4 className="mt-0.5 font-display text-[17px] font-semibold leading-tight text-ink">
            {stop.title}
          </h4>

          {stop.note && (
            <p className="mt-1 text-[13.5px] leading-snug text-sub">
              {stop.note}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
