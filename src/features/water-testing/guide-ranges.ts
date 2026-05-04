import type { PoolRecord } from "@/features/pools/data/pools";

export type GuideRange = {
  high?: number;
  label: string;
  low?: number;
  unit: string;
};

export const bioGuardRecommendationCategories = [
  "Sanitisers",
  "Oxidisers",
  "Algaecides",
  "Balancers",
  "Specialty",
  "Salt Pools",
  "Mineral Springs",
  "ProGuard/commercial",
] as const;

export const defaultGuideRanges = {
  calciumHardness: {
    high: 400,
    label: "Calcium hardness",
    low: 200,
    unit: "ppm",
  },
  combinedChlorine: {
    high: 0.2,
    label: "Combined chlorine",
    low: 0,
    unit: "ppm",
  },
  cyanuricAcid: {
    high: 50,
    label: "Cyanuric acid / stabiliser",
    low: 30,
    unit: "ppm",
  },
  freeChlorine: {
    high: 4,
    label: "Free chlorine",
    low: 2,
    unit: "ppm",
  },
  ph: {
    high: 7.6,
    label: "pH",
    low: 7.2,
    unit: "",
  },
  phosphate: {
    high: 500,
    label: "Phosphate",
    low: 0,
    unit: "ppb",
  },
  salt: {
    high: 4500,
    label: "Salt",
    low: 3500,
    unit: "ppm",
  },
  tds: {
    high: 2500,
    label: "TDS",
    low: 0,
    unit: "ppm",
  },
  totalAlkalinity: {
    high: 120,
    label: "Total alkalinity",
    low: 80,
    unit: "ppm",
  },
  totalChlorine: {
    high: 4,
    label: "Total chlorine",
    low: 2,
    unit: "ppm",
  },
  waterTemperature: {
    high: 32,
    label: "Water temperature",
    low: 18,
    unit: "C",
  },
} satisfies Record<string, GuideRange>;

export type GuideRangeKey = keyof typeof defaultGuideRanges;

export function getGuideRangesForPool(pool?: PoolRecord) {
  void pool;
  // TODO: Make this context-aware using pool type, indoor/outdoor exposure,
  // sanitiser system, chlorinator model/settings, surface type, water source,
  // salt/mineral/magnesium system details, and BioGuard catalogue logic.
  return defaultGuideRanges;
}

export function numericReading(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const parsed = Number(value.replace(/,/g, "").match(/-?\d+(\.\d+)?/)?.[0]);

  return Number.isFinite(parsed) ? parsed : null;
}

export function readingStatus(
  value: string | number | null | undefined,
  guide: GuideRange,
) {
  const reading = numericReading(value);

  if (reading === null) {
    return "Not tested";
  }

  if (guide.low !== undefined && reading < guide.low) {
    return "Low";
  }

  if (guide.high !== undefined && reading > guide.high) {
    return "High";
  }

  return "OK";
}
