CREATE TYPE "public"."customer_type" AS ENUM('residential', 'commercial', 'real_estate', 'property_manager', 'body_corporate');--> statement-breakpoint
CREATE TYPE "public"."document_kind" AS ENUM('before_photo', 'after_photo', 'equipment_photo', 'damage_photo', 'green_pool_photo', 'water_condition_photo', 'safety_issue_photo', 'repair_evidence_photo', 'completed_work_photo', 'approval', 'terms', 'customer_document', 'inspection_report', 'invoice', 'quote', 'warranty', 'manual');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('regular_pool_service', 'one_off_pool_service', 'green_pool_recovery', 'pool_inspection', 'equipment_repair', 'pump_repair', 'pump_replacement', 'chlorinator_repair', 'chlorinator_replacement', 'filter_service', 'filter_media_change', 'heater_service', 'leak_investigation', 'handover_service', 'quote_visit', 'warranty_visit', 'emergency_service', 'water_test_only', 'commercial_service', 'rental_property_inspection', 'pool_clean_up', 'debris_removal', 'system_check', 'customer_requested_work');--> statement-breakpoint
CREATE TYPE "public"."recurrence_frequency" AS ENUM('weekly', 'fortnightly', 'monthly', 'seasonal', 'custom');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"property_id" uuid,
	"job_id" uuid,
	"kind" "document_kind" NOT NULL,
	"label" text NOT NULL,
	"storage_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recurring_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"pool_id" uuid,
	"assigned_to_user_id" text,
	"frequency" "recurrence_frequency" NOT NULL,
	"preferred_service_day" text,
	"preferred_time_window" text,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'new'::text;--> statement-breakpoint
DROP TYPE "public"."job_status";--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('new', 'quote_required', 'quoted', 'quote_sent', 'quote_approved', 'quote_declined', 'ready_to_schedule', 'scheduled', 'on_the_way', 'in_progress', 'completed', 'report_sent', 'invoiced', 'paid', 'cancelled', 'on_hold', 'follow_up_required');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'new'::"public"."job_status";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE "public"."job_status" USING "status"::"public"."job_status";--> statement-breakpoint
ALTER TABLE "chemicals" ADD COLUMN "brand" text DEFAULT 'BioGuard' NOT NULL;--> statement-breakpoint
ALTER TABLE "chemicals" ADD COLUMN "product_strength" text;--> statement-breakpoint
ALTER TABLE "chemicals" ADD COLUMN "dosing_rules" text;--> statement-breakpoint
ALTER TABLE "chemicals" ADD COLUMN "application_method" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "customer_type" "customer_type" DEFAULT 'residential' NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "invoice_terms" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "preferred_service_day" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "communication_preferences" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "real_estate_agency_details" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "property_manager_details" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "owner_details" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "tenant_details" text;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "portal_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "equipment" ADD COLUMN "condition_notes" text;--> statement-breakpoint
ALTER TABLE "equipment" ADD COLUMN "replacement_recommendation" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "xero_sync_status" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_status" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "job_type" "job_type" DEFAULT 'regular_pool_service' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "on_the_way_at" timestamp;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "started_at" timestamp;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "technician_notes" text;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "recommendations" text;--> statement-breakpoint
ALTER TABLE "pools" ADD COLUMN "sanitiser_type" text;--> statement-breakpoint
ALTER TABLE "pools" ADD COLUMN "environment" text;--> statement-breakpoint
ALTER TABLE "pools" ADD COLUMN "target_ranges" text;--> statement-breakpoint
ALTER TABLE "pools" ADD COLUMN "normal_chemical_behaviour" text;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "pet_warnings" text;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "technician_notes" text;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "brand" text;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "supplier" text;--> statement-breakpoint
ALTER TABLE "stock_items" ADD COLUMN "selling_price_cents" integer;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "total_chlorine" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "combined_chlorine" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "phosphate" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "tds" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "water_temperature" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "copper" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "iron" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "borates" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "nitrates" real;--> statement-breakpoint
ALTER TABLE "water_tests" ADD COLUMN "source" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_jobs" ADD CONSTRAINT "recurring_jobs_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_jobs" ADD CONSTRAINT "recurring_jobs_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_jobs" ADD CONSTRAINT "recurring_jobs_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_jobs" ADD CONSTRAINT "recurring_jobs_assigned_to_user_id_users_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;