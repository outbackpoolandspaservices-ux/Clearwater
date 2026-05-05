CREATE TABLE IF NOT EXISTS "job_chemical_usage" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid,
  "job_id" uuid NOT NULL,
  "stock_id" uuid,
  "product_id" text,
  "product_name" text NOT NULL,
  "quantity" real NOT NULL,
  "unit" text NOT NULL,
  "reason" text,
  "notes" text,
  "stock_deducted" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "job_id" uuid;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "stock_id" uuid;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "product_id" text;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "product_name" text DEFAULT 'Chemical product' NOT NULL;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "quantity" real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "unit" text DEFAULT 'unit' NOT NULL;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "reason" text;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "notes" text;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "stock_deducted" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "job_chemical_usage" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_chemical_usage_job_id_idx" ON "job_chemical_usage" ("job_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_chemical_usage_product_id_idx" ON "job_chemical_usage" ("product_id");
