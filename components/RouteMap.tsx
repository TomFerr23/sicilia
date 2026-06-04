"use client";

// This component is only ever loaded via next/dynamic({ ssr: false }) from
// ItineraryClient, so it never runs on the server — a top-level Leaflet
// import (which touches `window`) is safe here.
import { useCallback, useEffect, useRef } from "react";
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
  const lineLayerRef = useRef<L.LayerGroup | null>(null);
  const arrowLayerRef = useRef<L.LayerGroup | null>(null);
  const pinLayerRef = useRef<L.LayerGroup | null>(null);
  // Current route + accent, read by the (stable) zoom handler.
  const dataRef = useRef<{ seq: [number, number][]; accent: string }>({
    seq: [],
    accent: plan.accent,
  });

  // Arrowheads point along each leg, so their screen angle depends on the
  // current zoom. Recompute them from pixel positions whenever zoom changes.
  const drawArrows = useCallback(() => {
    const map = mapRef.current;
    const layer = arrowLayerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const { seq, accent } = dataRef.current;

    for (let i = 0; i < seq.length - 1; i++) {
      const a = map.latLngToContainerPoint(seq[i]);
      const b = map.latLngToContainerPoint(seq[i + 1]);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      if (len < 34) continue; // skip tiny legs so the hub doesn't clutter
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const mid: [number, number] = [
        (seq[i][0] + seq[i + 1][0]) / 2,
        (seq[i][1] + seq[i + 1][1]) / 2,
      ];
      const icon = L.divIcon({
        className: "sicilia-arrow",
        html: `<svg viewBox="0 0 24 24" width="14" height="14" style="transform:rotate(${angle}deg)"><path d="M7 4l9 8-9 8" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 4l9 8-9 8" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      L.marker(mid, { icon, interactive: false, keyboard: false }).addTo(layer);
    }
  }, []);

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

    // Keep numbered pins above the direction arrows.
    map.createPane("pins").style.zIndex = "650";

    lineLayerRef.current = L.layerGroup().addTo(map);
    arrowLayerRef.current = L.layerGroup().addTo(map);
    pinLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on("zoomend", drawArrows);
    setTimeout(() => {
      map.invalidateSize();
      drawArrows();
    }, 120);

    return () => {
      map.off("zoomend", drawArrows);
      map.remove();
      mapRef.current = null;
      lineLayerRef.current = null;
      arrowLayerRef.current = null;
      pinLayerRef.current = null;
    };
  }, [drawArrows]);

  // (Re)draw the route whenever the plan changes (and on first mount).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lineLayerRef.current || !pinLayerRef.current) return;
    lineLayerRef.current.clearLayers();
    pinLayerRef.current.clearLayers();

    const { seq, points } = routeForPlan(plan);
    dataRef.current = { seq, accent: plan.accent };

    // Travel thread: a white casing under the accent line for a "route" look.
    L.polyline(seq, {
      color: "#ffffff",
      weight: 7,
      opacity: 0.9,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(lineLayerRef.current);
    L.polyline(seq, {
      color: plan.accent,
      weight: 3.5,
      opacity: 0.95,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(lineLayerRef.current);

    // Numbered pins, in the order you visit each place.
    points.forEach((p, i) => {
      const order = i + 1;
      const accent = TYPE_TOKENS[p.type].accent;
      const isStart = i === 0;
      const isEnd = i === points.length - 1;
      const icon = L.divIcon({
        className: "sicilia-pin",
        html: `<span class="${isStart ? "is-start" : ""}${isEnd ? " is-end" : ""}" style="--pin:${accent}">${order}</span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const dayLabel =
        p.days.length > 1
          ? `Days ${p.days[0]}–${p.days[p.days.length - 1]}`
          : `Day ${p.days[0]}`;
      const marker = L.marker(p.coord, { icon, pane: "pins" }).addTo(
        pinLayerRef.current!,
      );
      marker.bindTooltip(
        `<strong>${order}. ${p.label}</strong><span>${dayLabel}</span>`,
        {
          className: "sicilia-tip",
          direction: "top",
          offset: [0, -10],
          opacity: 1,
        },
      );
    });

    map.fitBounds(seq, { padding: [40, 40] });
    drawArrows();
  }, [plan, drawArrows]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-paper shadow-card">
      <div
        ref={containerRef}
        className="h-[320px] w-full sm:h-[400px]"
        style={{ backgroundColor: "#EDE7D6" }}
        aria-label={`Map of the ${plan.label} route through southeast Sicily, with stops numbered in visit order`}
        role="img"
      />
      <figcaption className="border-t border-line px-3 py-2.5 text-[11.5px] text-sub">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
        </div>
        <p className="mt-1.5 text-sub/90">
          <span className="font-semibold text-ink">①②③…</span> pins are
          numbered in the order you visit them · arrows show the direction of
          travel.
        </p>
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
