CREATE TABLE IF NOT EXISTS "chemical_products" (
  "id" text PRIMARY KEY NOT NULL,
  "organisation_id" uuid,
  "name" text NOT NULL,
  "brand" text DEFAULT 'BioGuard Australia' NOT NULL,
  "category" text NOT NULL,
  "subcategory" text,
  "active_ingredient" text,
  "purpose" text,
  "unit_type" text DEFAULT 'unit' NOT NULL,
  "product_strength" text,
  "dosing_notes" text,
  "application_method" text,
  "safety_notes" text,
  "related_water_issues" jsonb,
  "suitable_pool_conditions" jsonb,
  "compatible_pool_types" jsonb,
  "notes" text,
  "status" text DEFAULT 'Active' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "brand" text DEFAULT 'BioGuard Australia' NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "category" text DEFAULT 'Specialty' NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "subcategory" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "active_ingredient" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "purpose" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "unit_type" text DEFAULT 'unit' NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "product_strength" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "dosing_notes" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "application_method" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "safety_notes" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "related_water_issues" jsonb;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "suitable_pool_conditions" jsonb;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "compatible_pool_types" jsonb;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "notes" text;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'Active' NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "chemical_products" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chemical_products_brand_idx" ON "chemical_products" ("brand");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chemical_products_category_idx" ON "chemical_products" ("category");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chemical_products_status_idx" ON "chemical_products" ("status");
