export type StopType =
  | "air"
  | "sea"
  | "city"
  | "town"
  | "beach"
  | "volcano"
  | "water"
  | "food";

export type ImgKey =
  | "catania"
  | "taormina"
  | "ortigia"
  | "cavagrande"
  | "noto"
  | "vendicari"
  | "marzamemi"
  | "ragusa"
  | "modica"
  | "scicli";

export interface Via {
  dur: string; // e.g. "1h15"
  dist: string; // e.g. "70 km"
}

export interface Stop {
  time: string; // "08:00" | "≈15:00" | "Afternoon" | "+30 min"
  title: string;
  type: StopType;
  img?: ImgKey; // key into IMAGES map; omit for transit stops
  note?: string;
  gem?: boolean; // shows "hidden gem" tag
  via?: Via; // how you travel TO this stop from the previous one
}

export interface Day {
  n: number;
  date: string;
  title: string;
  sleep: string; // "—" if departure
  stops: Stop[];
  ferragosto?: boolean; // shows the Aug-15 warning banner
  depart?: boolean; // departure day styling
}

export interface Plan {
  key: "plane" | "ferry";
  label: string;
  sub: string;
  accent: string;
  blurb: string;
  drivingTotal: string;
  days: Day[];
}

/**
 * Photo URLs keyed by location. StopImage handles load failure with a
 * type-toned emoji fallback, so a broken/missing URL never shows as a
 * broken image. Etna, Punta Secca and the ferry/transit stops have no
 * photo and intentionally use the fallback.
 */
const WM = "https://upload.wikimedia.org/wikipedia/commons/thumb";

export const IMAGES: Record<ImgKey, string> = {
  catania: `${WM}/f/f5/Piazza_del_Duomo%2C_Catania_2024.jpg/500px-Piazza_del_Duomo%2C_Catania_2024.jpg`,
  taormina: `${WM}/e/e2/Taormina_-_the_greek_theater%2C_with_mount_Etna_in_the_background.jpg/500px-Taormina_-_the_greek_theater%2C_with_mount_Etna_in_the_background.jpg`,
  ortigia: `${WM}/9/91/Siracusa%2C_Ortigia%2C_Piazza_Duomo.jpg/500px-Siracusa%2C_Ortigia%2C_Piazza_Duomo.jpg`,
  cavagrande: `${WM}/8/82/Cavagrande_del_Cassibile-pjt.jpg/500px-Cavagrande_del_Cassibile-pjt.jpg`,
  noto: `${WM}/1/1f/Noto_Never_ending_baroque_-_panoramio.jpg/500px-Noto_Never_ending_baroque_-_panoramio.jpg`,
  vendicari: `${WM}/8/80/Spiaggia_di_Calamosche_%28SICILIA%29.jpg/500px-Spiaggia_di_Calamosche_%28SICILIA%29.jpg`,
  marzamemi: `${WM}/3/3e/Piazza_di_Marzamemi_01.jpg/500px-Piazza_di_Marzamemi_01.jpg`,
  ragusa: `${WM}/f/fc/Panorama_Ragusa_Ibla.JPG/500px-Panorama_Ragusa_Ibla.JPG`,
  modica: `${WM}/c/c2/Modica%2C_Duomo_di_San_Giorgio.jpg/500px-Modica%2C_Duomo_di_San_Giorgio.jpg`,
  scicli: `${WM}/0/00/Largo_Antonio_Gramsci%2C_Scicli%2C_Sicily.jpg/500px-Largo_Antonio_Gramsci%2C_Scicli%2C_Sicily.jpg`,
};

const ortigiaNote =
  "Your base for 3 nights — a tiny island of honey stone. Swim off the rocks at Forte Vigliena, aperitivo in Piazza Duomo, fish market before 13:00.";

/**
 * Days 4–6 are identical in both plans, so they're defined once and shared.
 */
const midDays: Day[] = [
  {
    n: 4,
    date: "Wed 13 Aug",
    title: "Freshwater canyon + baroque Noto",
    sleep: "Ortìgia",
    stops: [
      {
        time: "08:00",
        title: "Cavagrande del Cassibile",
        type: "water",
        gem: true,
        img: "cavagrande",
        via: { dur: "40 min", dist: "32 km" },
        note: "Turquoise river pools at the bottom of a gorge. Go at opening — the climb back up is brutal by midday. Proper shoes + lots of water.",
      },
      {
        time: "17:00",
        title: "Noto",
        type: "town",
        img: "noto",
        via: { dur: "35 min", dist: "30 km" },
        note: "The honey-gold baroque capital, best at golden hour when the stone glows. Granita at Caffè Sicilia.",
      },
      {
        time: "20:30",
        title: "Back to Ortìgia",
        type: "city",
        img: "ortigia",
        via: { dur: "40 min", dist: "33 km" },
        note: "Dinner on the island.",
      },
    ],
  },
  {
    n: 5,
    date: "Thu 14 Aug",
    title: "Wild beaches + a fishing village",
    sleep: "Ortìgia",
    stops: [
      {
        time: "09:00",
        title: "Calamosche, Vendicari Reserve",
        type: "beach",
        gem: true,
        img: "vendicari",
        via: { dur: "45 min", dist: "42 km" },
        note: "20-min walk in through the reserve to a wild cove — no bars, no loungers, clear water. Flamingos in the lagoons if you're lucky.",
      },
      {
        time: "19:00",
        title: "Marzamemi",
        type: "food",
        img: "marzamemi",
        via: { dur: "25 min", dist: "16 km" },
        note: "Old tuna-fishery village. Dinner of fresh fish on the seaside piazza as the sun drops.",
      },
      {
        time: "22:00",
        title: "Back to Ortìgia",
        type: "city",
        img: "ortigia",
        via: { dur: "45 min", dist: "47 km" },
      },
    ],
  },
  {
    n: 6,
    date: "Fri 15 Aug",
    title: "Inland baroque — skip the mobbed beaches",
    sleep: "Ragusa or Modica",
    ferragosto: true,
    stops: [
      {
        time: "11:00",
        title: "Ragusa Ibla",
        type: "town",
        img: "ragusa",
        via: { dur: "1h15", dist: "78 km" },
        note: "Stunning hill town stacked on a ridge. Lunch, then the evening passeggiata.",
      },
      {
        time: "15:30",
        title: "Modica",
        type: "town",
        img: "modica",
        via: { dur: "25 min", dist: "15 km" },
        note: "Cold-process Aztec-style chocolate at Antica Dolceria Bonajuto. Dramatic staircase churches.",
      },
      {
        time: "18:30",
        title: "Scicli",
        type: "town",
        gem: true,
        img: "scicli",
        via: { dur: "25 min", dist: "12 km" },
        note: "Quietest of the three, pure Montalbano backdrop. Lovely at dusk.",
      },
    ],
  },
];

const planePlan: Plan = {
  key: "plane",
  label: "By plane",
  sub: "Fly Roma → Catania",
  accent: "#1E4E8C",
  blurb:
    "Frequent ~1h10 hops from Rome (FCO/CIA) land at Catania (CTA) — the most central airport for the southeast. Note: Siracusa has no real airport; you'd still fly Catania and drive ~1h. Pick the car up at CTA.",
  drivingTotal: "≈ 600 km over 7 days",
  days: [
    {
      n: 1,
      date: "Sun 10 Aug",
      title: "Land in Catania",
      sleep: "Catania",
      stops: [
        {
          time: "≈15:00",
          title: "Catania Airport (CTA)",
          type: "air",
          note: "Land, collect the rental car, 15-min drive into town.",
        },
        {
          time: "18:00",
          title: "Catania centro",
          type: "city",
          img: "catania",
          via: { dur: "15 min", dist: "8 km" },
          note: "Easy first evening: the La Pescheria fish market, baroque Via Etnea, your first arancino. Don't overplan — you'll be tired.",
        },
      ],
    },
    {
      n: 2,
      date: "Mon 11 Aug",
      title: "Etna + Taormina",
      sleep: "Taormina / Giardini Naxos",
      stops: [
        {
          time: "08:00",
          title: "Mt Etna — Rifugio Sapienza",
          type: "volcano",
          gem: true,
          via: { dur: "1h05", dist: "63 km" },
          note: "Go in the cool morning. Cable car + 4x4 to ~2900 m, or hike the lower craters. Layers — it's cold and ashy up top.",
        },
        {
          time: "13:30",
          title: "Taormina + Isola Bella",
          type: "town",
          img: "taormina",
          via: { dur: "1h15", dist: "70 km" },
          note: "Park below and take the cable car (centre is pedestrian). Greek theatre, then a swim at Isola Bella.",
        },
      ],
    },
    {
      n: 3,
      date: "Tue 12 Aug",
      title: "South to Ortìgia",
      sleep: "Ortìgia",
      stops: [
        {
          time: "11:30",
          title: "Ortìgia (Siracusa)",
          type: "city",
          img: "ortigia",
          via: { dur: "1h30", dist: "120 km" },
          note: ortigiaNote,
        },
      ],
    },
    ...midDays,
    {
      n: 7,
      date: "Sat 16 Aug",
      title: "Last swim, then back north",
      sleep: "Near Catania (CTA)",
      stops: [
        {
          time: "10:00",
          title: "Punta Secca",
          type: "beach",
          gem: true,
          via: { dur: "50 min", dist: "35 km" },
          note: "Tiny seaside hamlet — Montalbano's house and a gentle sandy beach for a final swim.",
        },
        {
          time: "14:00",
          title: "Drive to Catania",
          type: "city",
          img: "catania",
          via: { dur: "2h00", dist: "150 km" },
          note: "Sleep near the airport so the 17th flight is stress-free.",
        },
      ],
    },
    {
      n: 8,
      date: "Sun 17 Aug",
      title: "Departure",
      sleep: "—",
      depart: true,
      stops: [
        {
          time: "AM",
          title: "Fly out of Catania (CTA)",
          type: "air",
          note: "Drop the car at the airport and fly home.",
        },
      ],
    },
  ],
};

const ferryPlan: Plan = {
  key: "ferry",
  label: "By car + ferry",
  sub: "Drive down · ferry the Strait",
  accent: "#16365F",
  blurb:
    "Drive the length of Italy to Villa San Giovanni (Calabria) and cross the Strait of Messina by ferry (~30 min crossing, departures every 20–40 min). Buy tickets via the app to skip queues — Ferragosto week is busy. You enter Sicily at Messina, so Taormina comes first naturally.",
  drivingTotal: "≈ 760 km on-island + the long haul north on the last days",
  days: [
    {
      n: 1,
      date: "Sun 10 Aug",
      title: "Ferry across + Taormina",
      sleep: "Taormina / Giardini Naxos",
      stops: [
        {
          time: "—",
          title: "Villa San Giovanni — embark",
          type: "sea",
          note: "Drive onto the ferry. ~€38 per car one-way; get tickets on the app beforehand.",
        },
        {
          time: "+30 min",
          title: "Port of Messina",
          type: "sea",
          via: { dur: "30 min", dist: "Strait crossing" },
          note: "Roll off in Sicily's northeast corner.",
        },
        {
          time: "Afternoon",
          title: "Taormina + Isola Bella",
          type: "town",
          img: "taormina",
          via: { dur: "50 min", dist: "52 km" },
          note: "Settle in, swim at Isola Bella, sunset over the bay. Easy first day after the drive.",
        },
      ],
    },
    {
      n: 2,
      date: "Mon 11 Aug",
      title: "Etna, then Catania",
      sleep: "Catania",
      stops: [
        {
          time: "08:30",
          title: "Mt Etna — Rifugio Sapienza",
          type: "volcano",
          gem: true,
          via: { dur: "1h30", dist: "85 km" },
          note: "Cool-morning ascent. Cable car + 4x4 up high, or hike the lower craters. Bring layers.",
        },
        {
          time: "16:00",
          title: "Catania centro",
          type: "city",
          img: "catania",
          via: { dur: "1h05", dist: "65 km" },
          note: "La Pescheria fish market, Via Etnea, first arancino. Park outside the ZTL and walk in.",
        },
      ],
    },
    {
      n: 3,
      date: "Tue 12 Aug",
      title: "South to Ortìgia",
      sleep: "Ortìgia",
      stops: [
        {
          time: "11:00",
          title: "Ortìgia (Siracusa)",
          type: "city",
          img: "ortigia",
          via: { dur: "1h00", dist: "65 km" },
          note: ortigiaNote,
        },
      ],
    },
    ...midDays,
    {
      n: 7,
      date: "Sat 16 Aug",
      title: "Last swim, then north toward the Strait",
      sleep: "Taormina / Messina",
      stops: [
        {
          time: "09:30",
          title: "Punta Secca",
          type: "beach",
          gem: true,
          via: { dur: "50 min", dist: "35 km" },
          note: "Montalbano's house + a final gentle swim before the long drive north.",
        },
        {
          time: "14:00",
          title: "Drive north",
          type: "town",
          img: "taormina",
          via: { dur: "2h45", dist: "230 km" },
          note: "Base near Taormina or Messina so the ferry out is short in the morning.",
        },
      ],
    },
    {
      n: 8,
      date: "Sun 17 Aug",
      title: "Ferry home",
      sleep: "—",
      depart: true,
      stops: [
        {
          time: "AM",
          title: "Messina → Villa San Giovanni",
          type: "sea",
          via: { dur: "30 min", dist: "Strait crossing" },
          note: "Cross back and drive onward up the mainland.",
        },
      ],
    },
  ],
};

export const PLANS: Record<"plane" | "ferry", Plan> = {
  plane: planePlan,
  ferry: ferryPlan,
};

export const FERRAGOSTO_TEXT =
  "Aug 15 is Ferragosto — half of Italy hits the beach. Spend it in the hill towns instead.";

export const FOOTER_TIPS = [
  "book beaches, restaurants & the Ferragosto hotel now",
  "beaches & canyon before 11:00, towns after 17:00",
  "avoid town-centre ZTL zones (camera fines) — park outside & walk in",
];

/**
 * Approximate [lat, lng] for every stop, keyed by its title. Used by the
 * route map to plot pins and draw the day-by-day driving thread. Repeated
 * bases (Ortìgia) and "drive to X" stops resolve to the same point as the
 * place itself.
 */
export const COORDS: Record<string, [number, number]> = {
  "Catania Airport (CTA)": [37.4668, 15.0664],
  "Fly out of Catania (CTA)": [37.4668, 15.0664],
  "Catania centro": [37.5025, 15.0873],
  "Drive to Catania": [37.5025, 15.0873],
  "Mt Etna — Rifugio Sapienza": [37.6997, 14.999],
  "Taormina + Isola Bella": [37.8517, 15.2853],
  "Drive north": [37.8517, 15.2853],
  "Ortìgia (Siracusa)": [37.059, 15.293],
  "Back to Ortìgia": [37.059, 15.293],
  "Cavagrande del Cassibile": [37.0316, 15.084],
  Noto: [36.8907, 15.0696],
  "Calamosche, Vendicari Reserve": [36.807, 15.106],
  Marzamemi: [36.738, 15.1185],
  "Ragusa Ibla": [36.9258, 14.746],
  Modica: [36.8585, 14.7615],
  Scicli: [36.7906, 14.703],
  "Punta Secca": [36.788, 14.487],
  "Villa San Giovanni — embark": [38.2206, 15.636],
  "Port of Messina": [38.1936, 15.566],
  "Messina → Villa San Giovanni": [38.1936, 15.566],
};

/** Short, map-friendly labels for pins (the full title can be long). */
export const SHORT_LABEL: Record<string, string> = {
  "Catania Airport (CTA)": "Catania airport",
  "Fly out of Catania (CTA)": "Catania airport",
  "Catania centro": "Catania",
  "Drive to Catania": "Catania",
  "Mt Etna — Rifugio Sapienza": "Mt Etna",
  "Taormina + Isola Bella": "Taormina",
  "Drive north": "Taormina",
  "Ortìgia (Siracusa)": "Ortìgia",
  "Back to Ortìgia": "Ortìgia",
  "Cavagrande del Cassibile": "Cavagrande",
  Noto: "Noto",
  "Calamosche, Vendicari Reserve": "Vendicari",
  Marzamemi: "Marzamemi",
  "Ragusa Ibla": "Ragusa Ibla",
  Modica: "Modica",
  Scicli: "Scicli",
  "Punta Secca": "Punta Secca",
  "Villa San Giovanni — embark": "Villa S. Giovanni",
  "Port of Messina": "Messina",
  "Messina → Villa San Giovanni": "Messina",
};

export interface RoutePoint {
  title: string;
  label: string;
  type: StopType;
  coord: [number, number];
  days: number[]; // day numbers that touch this place
}

/**
 * Ordered list of plotted points for a plan's full journey, with immediate
 * consecutive duplicates collapsed (e.g. day-trips that return to Ortìgia
 * keep the thread but don't stack a pin on itself). `seq` is the polyline
 * path; `points` are the de-duplicated pins.
 */
export function routeForPlan(plan: Plan): {
  seq: [number, number][];
  points: RoutePoint[];
} {
  const seq: [number, number][] = [];
  const byKey = new Map<string, RoutePoint>();
  let prevKey = "";

  for (const day of plan.days) {
    for (const stop of day.stops) {
      const coord = COORDS[stop.title];
      if (!coord) continue;
      const key = `${coord[0]},${coord[1]}`;
      if (key !== prevKey) {
        seq.push(coord);
        prevKey = key;
      }
      const existing = byKey.get(key);
      if (existing) {
        if (!existing.days.includes(day.n)) existing.days.push(day.n);
      } else {
        byKey.set(key, {
          title: stop.title,
          label: SHORT_LABEL[stop.title] ?? stop.title,
          type: stop.type,
          coord,
          days: [day.n],
        });
      }
    }
  }

  return { seq, points: [...byKey.values()] };
}
