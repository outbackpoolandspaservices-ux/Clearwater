import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredPages = [
  "src/app/page.tsx",
  "src/app/services/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/about/page.tsx",
  "src/app/gallery/page.tsx",
  "src/app/quote/page.tsx",
  "src/app/contact/page.tsx",
];

const files = [
  "src/features/outback-aircon/site-data.ts",
  "src/features/outback-aircon/website-shell.tsx",
  ...requiredPages,
].map((file) => path.join(root, file));

const source = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");

const checks = [
  ["all required pages exist", requiredPages.every((file) => fs.existsSync(path.join(root, file)))],
  ["Regular Cleaning exists", source.includes("Regular Cleaning")],
  ["Steam Cleaning exists", source.includes("Steam Cleaning")],
  ["Ozone Cleaning exists", source.includes("Ozone Cleaning")],
  ["mobile phone link uses tel:", source.includes("tel:0451748807")],
  ["landline phone link uses tel:", source.includes("tel:0882348807")],
  ["email link uses mailto:", source.includes("mailto:outbackairconservices@gmail.com")],
  ["CTA buttons point to quote page", (source.match(/href="\/quote"|href: "\/quote"/g) ?? []).length >= 6],
  ["gallery section exists", source.includes("Before and after gallery") && source.includes("GalleryGrid")],
];

const failures = checks.filter(([, passed]) => !passed);

if (failures.length > 0) {
  console.error("Outback Aircon site checks failed:");
  for (const [label] of failures) {
    console.error(`- ${label}`);
  }
  process.exit(1);
}

console.log(`Outback Aircon site checks passed (${checks.length}/${checks.length}).`);
