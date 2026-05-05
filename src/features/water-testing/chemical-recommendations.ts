import type { ChemicalProductRecord } from "@/features/chemicals/data/chemicals";
import type { PoolRecord } from "@/features/pools/data/pools";
import type { WaterTestRecord } from "@/features/water-testing/data/water-tests";
import {
  defaultGuideRanges,
  numericReading,
  readingStatus,
} from "@/features/water-testing/guide-ranges";

export type ChemicalRecommendation = {
  id: string;
  issue: string;
  possibleProducts: ChemicalProductRecord[];
  reviewNote: string;
  suggestedCategory: string;
};

function productMatches(
  product: ChemicalProductRecord,
  terms: string[],
  category?: string,
) {
  const haystack = [
    product.id,
    product.name,
    product.category,
    product.subcategory,
    product.purpose,
    product.relatedWaterIssues.join(" "),
    product.notes,
  ]
    .join(" ")
    .toLowerCase();

  return (
    (!category || product.category.toLowerCase() === category.toLowerCase()) &&
    terms.some((term) => haystack.includes(term.toLowerCase()))
  );
}

function pickProducts(
  products: ChemicalProductRecord[],
  terms: string[],
  category?: string,
) {
  return products
    .filter((product) => productMatches(product, terms, category))
    .slice(0, 4);
}

function recommendation({
  category,
  id,
  issue,
  products,
  terms,
}: {
  category: string;
  id: string;
  issue: string;
  products: ChemicalProductRecord[];
  terms: string[];
}) {
  return {
    id,
    issue,
    suggestedCategory: category,
    possibleProducts: pickProducts(products, terms, category),
    reviewNote:
      "Technician review required. Confirm current readings, pool context, product label, and SDS before adding chemicals or sending customer-facing advice.",
  };
}

export function buildChemicalRecommendations({
  pool,
  products,
  test,
}: {
  pool?: PoolRecord;
  products: ChemicalProductRecord[];
  test: WaterTestRecord;
}): ChemicalRecommendation[] {
  const recommendations: ChemicalRecommendation[] = [];
  const freeChlorineStatus = readingStatus(
    test.freeChlorine,
    defaultGuideRanges.freeChlorine,
  );
  const combinedChlorineStatus = readingStatus(
    test.combinedChlorine,
    defaultGuideRanges.combinedChlorine,
  );
  const phStatus = readingStatus(test.ph, defaultGuideRanges.ph);
  const alkalinityStatus = readingStatus(
    test.alkalinity,
    defaultGuideRanges.totalAlkalinity,
  );
  const calciumStatus = readingStatus(
    test.calciumHardness,
    defaultGuideRanges.calciumHardness,
  );
  const cyaStatus = readingStatus(
    test.cyanuricAcid,
    defaultGuideRanges.cyanuricAcid,
  );
  const phosphateStatus = readingStatus(
    test.phosphate,
    defaultGuideRanges.phosphate,
  );
  const notes = `${test.notes} ${test.alerts.join(" ")}`.toLowerCase();
  const algaeNoted = notes.includes("algae") || notes.includes("green");
  const saltPool =
    pool?.sanitiserType?.toLowerCase().includes("salt") ||
    pool?.sanitiserType?.toLowerCase().includes("mineral");
  const highScaleRisk =
    phStatus === "High" ||
    calciumStatus === "High" ||
    numericReading(test.salt) !== null;

  if (freeChlorineStatus === "Low") {
    recommendations.push(
      recommendation({
        category: "Sanitisers",
        id: "low-chlorine-sanitiser",
        issue: "Low chlorine",
        products,
        terms: ["chlor", "sanitis", "cal chlor", "power chlor", "tabs", "sticks"],
      }),
      recommendation({
        category: "Oxidisers",
        id: "low-chlorine-oxidiser",
        issue: "Low chlorine / oxidiser support",
        products,
        terms: ["burn out", "oxid", "oxysheen", "swim clear"],
      }),
    );
  }

  if (combinedChlorineStatus === "High") {
    recommendations.push(
      recommendation({
        category: "Oxidisers",
        id: "combined-chlorine-oxidiser",
        issue: "High combined chlorine",
        products,
        terms: ["oxid", "burn out", "oxysheen", "swim clear"],
      }),
    );
  }

  if (phStatus === "Low") {
    recommendations.push(
      recommendation({
        category: "Balancers",
        id: "low-ph-balancer",
        issue: "Low pH",
        products,
        terms: ["balance pak 200", "ph increaser"],
      }),
    );
  }

  if (phStatus === "High") {
    recommendations.push(
      recommendation({
        category: "Balancers",
        id: "high-ph-acid",
        issue: "High pH",
        products,
        terms: ["lo'n'slo", "lo 'n slo", "pool acid", "acid", "reducer"],
      }),
    );
  }

  if (alkalinityStatus === "Low") {
    recommendations.push(
      recommendation({
        category: "Balancers",
        id: "low-alkalinity",
        issue: "Low alkalinity",
        products,
        terms: ["balance pak 100", "alkalinity increaser"],
      }),
    );
  }

  if (alkalinityStatus === "High") {
    recommendations.push(
      recommendation({
        category: "Balancers",
        id: "high-alkalinity",
        issue: "High alkalinity",
        products,
        terms: ["lo'n'slo", "pool acid", "acid"],
      }),
    );
  }

  if (calciumStatus === "Low") {
    recommendations.push(
      recommendation({
        category: "Balancers",
        id: "low-calcium",
        issue: "Low calcium hardness",
        products,
        terms: ["balance pak 300", "calcium"],
      }),
    );
  }

  if (calciumStatus === "High") {
    recommendations.push(
      recommendation({
        category: "Specialty",
        id: "high-calcium-scale",
        issue: "High calcium hardness / scale risk",
        products,
        terms: ["scale", "stain", "inhibitor"],
      }),
    );
  }

  if (cyaStatus === "High") {
    recommendations.push({
      id: "high-cya-warning",
      issue: "High cyanuric acid",
      suggestedCategory: "Service recommendation",
      possibleProducts: [],
      reviewNote:
        "Technician review required. High CYA is normally handled with dilution/water replacement planning rather than adding another product.",
    });
  }

  if (phosphateStatus === "High") {
    recommendations.push(
      recommendation({
        category: "Specialty",
        id: "high-phosphate",
        issue: "High phosphate",
        products,
        terms: ["phos", "phosphate"],
      }),
    );
  }

  if (algaeNoted) {
    recommendations.push(
      recommendation({
        category: "Algaecides",
        id: "algae-noted",
        issue: "Algae noted",
        products,
        terms: ["algi", "algae", "msa", "polygard"],
      }),
    );
  }

  if (saltPool && highScaleRisk) {
    recommendations.push(
      recommendation({
        category: "Salt Pools",
        id: "salt-pool-scale-risk",
        issue: "Salt pool scale risk",
        products,
        terms: ["salt pool stain", "salt pool protector", "scale"],
      }),
    );
  }

  return recommendations;
}
