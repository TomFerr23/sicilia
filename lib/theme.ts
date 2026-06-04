import {
  Plane,
  Ship,
  Landmark,
  Waves,
  Mountain,
  Droplets,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { StopType } from "./itinerary";

export const COLORS = {
  cream: "#FBF5E6",
  paper: "#FFFDF6",
  ink: "#2B2218",
  sub: "#7A6A52",
  sea: "#1E4E8C",
  seaDeep: "#16365F",
  terra: "#C5552E",
  gold: "#C79A3A",
  olive: "#6E7A4A",
  line: "#E4D8BE",
} as const;

export interface TypeToken {
  icon: LucideIcon;
  accent: string; // dot / icon accent color
  tone: string; // pale background for fallback + thumbnails
  emoji: string; // fallback glyph
}

/**
 * Each stop `type` maps to an icon, an accent color, a pale tone background
 * (used for the image fallback), and an emoji used when an image fails to load.
 */
export const TYPE_TOKENS: Record<StopType, TypeToken> = {
  air: { icon: Plane, accent: COLORS.sea, tone: "#DCE8F5", emoji: "✈️" },
  sea: { icon: Ship, accent: COLORS.seaDeep, tone: "#D4E2EF", emoji: "⛴️" },
  city: { icon: Landmark, accent: COLORS.terra, tone: "#F4DDD0", emoji: "🏛️" },
  town: { icon: Landmark, accent: COLORS.gold, tone: "#F2E6C4", emoji: "⛪" },
  beach: { icon: Waves, accent: COLORS.sea, tone: "#D8E9EC", emoji: "🏖️" },
  volcano: { icon: Mountain, accent: "#8A4B2E", tone: "#EAD9CC", emoji: "🌋" },
  water: { icon: Droplets, accent: "#2C7C8C", tone: "#D2EAEC", emoji: "💧" },
  food: {
    icon: UtensilsCrossed,
    accent: COLORS.olive,
    tone: "#E6E9D5",
    emoji: "🍝",
  },
};
