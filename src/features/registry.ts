import { appNavItems } from "./navigation";

export type FeatureArea = {
  title: string;
  href: string;
  description: string;
  status: "foundation" | "planned";
};

export const featureAreas: FeatureArea[] = appNavItems.map((item) => ({
  ...item,
  status: "foundation",
}));

export function getFeatureArea(href: string) {
  return featureAreas.find((area) => area.href === href);
}
