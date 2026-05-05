DO $$ BEGIN
  CREATE TYPE "public"."stock_movement_type" AS ENUM(
    'adjustment',
    'transfer',
    'job_usage',
    'reorder',
    'receive',
    'write_off'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid,
  "product_id" text NOT NULL,
  "van_user_id" text,
  "location_name" text NOT NULL,
  "quantity_on_hand" real DEFAULT 0 NOT NULL,
  "unit" text NOT NULL,
  "unit_cost_cents" integer,
  "selling_price_cents" integer,
  "low_stock_threshold" real DEFAULT 0 NOT NULL,
  "supplier" text,
  "status" text DEFAULT 'Active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "product_id" text;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "van_user_id" text;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "location_name" text DEFAULT 'Service van' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "quantity_on_hand" real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "unit" text DEFAULT 'unit' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "unit_cost_cents" integer;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "selling_price_cents" integer;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "low_stock_threshold" real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "supplier" text;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'Active' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock_movements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid,
  "stock_id" uuid,
  "product_id" text NOT NULL,
  "job_id" uuid,
  "visit_id" uuid,
  "movement_type" text NOT NULL,
  "quantity" real NOT NULL,
  "unit" text NOT NULL,
  "note" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "stock_id" uuid;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "product_id" text;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "job_id" uuid;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "visit_id" uuid;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "movement_type" text DEFAULT 'adjustment' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "quantity" real DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "unit" text DEFAULT 'unit' NOT NULL;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "note" text;
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_product_id_idx" ON "stock" ("product_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_van_user_id_idx" ON "stock" ("van_user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_movements_product_id_idx" ON "stock_movements" ("product_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "stock_movements_job_id_idx" ON "stock_movements" ("job_id");
