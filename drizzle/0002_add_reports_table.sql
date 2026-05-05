DO $$ BEGIN
  CREATE TYPE "public"."report_type" AS ENUM(
    'service_report',
    'pool_inspection_report',
    'water_test_report'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."report_status" AS ENUM(
    'draft',
    'ready',
    'sent',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organisation_id" uuid,
  "customer_id" uuid NOT NULL,
  "site_id" uuid,
  "property_id" uuid,
  "pool_id" uuid,
  "job_id" uuid,
  "visit_id" uuid,
  "water_test_id" uuid,
  "technician_id" text,
  "report_number" text NOT NULL,
  "report_type" "public"."report_type" DEFAULT 'service_report' NOT NULL,
  "status" "public"."report_status" DEFAULT 'draft' NOT NULL,
  "report_date" timestamp DEFAULT now(),
  "customer_summary" text,
  "work_completed" text,
  "summary" text,
  "findings" text,
  "recommendations" text,
  "follow_up_required" boolean DEFAULT false NOT NULL,
  "next_service_recommendation" text,
  "internal_notes" text,
  "notes" text,
  "metadata" jsonb,
  "sent_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "reports_report_number_unique" UNIQUE("report_number")
);
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "organisation_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "customer_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "site_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "property_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "pool_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "job_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "visit_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "water_test_id" uuid;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "technician_id" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "report_number" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "report_type" "public"."report_type" DEFAULT 'service_report' NOT NULL;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "status" "public"."report_status" DEFAULT 'draft' NOT NULL;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "report_date" timestamp DEFAULT now();
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "customer_summary" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "work_completed" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "summary" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "findings" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "recommendations" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "follow_up_required" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "next_service_recommendation" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "internal_notes" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "notes" text;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "metadata" jsonb;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "sent_at" timestamp;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reports_report_number_idx" ON "reports" ("report_number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_customer_id_idx" ON "reports" ("customer_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_job_id_idx" ON "reports" ("job_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reports_status_idx" ON "reports" ("status");
