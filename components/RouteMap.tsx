"use client";

// This component is only ever loaded via next/dynamic({ ssr: false }) from
// ItineraryClient, so it never runs on the server — a top-level Leaflet
// import (which touches `window`) is safe here.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Plan, routeForPlan } from "@/lib/itinerary";
import { TYPE_TOKENS, COLORS } from "@/lib/theme";

interface RouteMapProps {
  plan: Plan;
}

// The southeast corner, framed so the whole loop is visible before fit.
const FALLBACK_BOUNDS: [[number, number], [number, number]] = [
  [36.65, 14.4],
  [38.3, 15.7],
];

export default function RouteMap({ plan }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false, // don't hijack page scroll
      zoomControl: true,
      attributionControl: true,
    });
    map.fitBounds(FALLBACK_BOUNDS);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(map);

    routeLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 120);

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  // (Re)draw the route whenever the plan changes (and on first mount).
  useEffect(() => {
    const map = mapRef.current;
    const layer = routeLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const { seq, points } = routeForPlan(plan);

    // Travel thread: a white casing under the accent line for a "route" look.
    L.polyline(seq, {
      color: "#ffffff",
      weight: 7,
      opacity: 0.9,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(layer);
    L.polyline(seq, {
      color: plan.accent,
      weight: 3.5,
      opacity: 0.95,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(layer);

    for (const p of points) {
      const accent = TYPE_TOKENS[p.type].accent;
      const icon = L.divIcon({
        className: "sicilia-pin",
        html: `<span style="--pin:${accent}"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const dayLabel =
        p.days.length > 1
          ? `Days ${p.days[0]}–${p.days[p.days.length - 1]}`
          : `Day ${p.days[0]}`;
      L.marker(p.coord, { icon })
        .addTo(layer)
        .bindTooltip(`<strong>${p.label}</strong><span>${dayLabel}</span>`, {
          className: "sicilia-tip",
          direction: "top",
          offset: [0, -8],
          opacity: 1,
        });
    }

    if (seq.length) map.fitBounds(seq, { padding: [34, 34] });
  }, [plan]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      <div
        ref={containerRef}
        className="h-[300px] w-full sm:h-[360px]"
        style={{ backgroundColor: "#EDE7D6" }}
        aria-label={`Map of the ${plan.label} route through southeast Sicily`}
        role="img"
      />
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line px-3 py-2.5 text-[11.5px] text-sub">
        <span className="font-semibold uppercase tracking-wide text-ink">
          Legend
        </span>
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-white"
              style={{ backgroundColor: l.color }}
            />
            {l.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-[3px] w-5 rounded-full"
            style={{ backgroundColor: plan.accent }}
          />
          driving thread
        </span>
      </figcaption>
    </figure>
  );
}

const LEGEND: { label: string; color: string }[] = [
  { label: "city", color: TYPE_TOKENS.city.accent },
  { label: "town", color: TYPE_TOKENS.town.accent },
  { label: "beach", color: TYPE_TOKENS.beach.accent },
  { label: "canyon", color: TYPE_TOKENS.water.accent },
  { label: "volcano", color: TYPE_TOKENS.volcano.accent },
  { label: "food", color: TYPE_TOKENS.food.accent },
  { label: "ferry/air", color: COLORS.seaDeep },
];
