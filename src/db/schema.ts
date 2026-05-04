import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const appRole = pgEnum("app_role", [
  "owner",
  "admin",
  "dispatcher",
  "technician",
  "finance",
  "customer",
]);

export const customerType = pgEnum("customer_type", [
  "residential",
  "commercial",
  "real_estate",
  "property_manager",
  "body_corporate",
]);

export const jobStatus = pgEnum("job_status", [
  "new",
  "quote_required",
  "quoted",
  "quote_sent",
  "quote_approved",
  "quote_declined",
  "ready_to_schedule",
  "scheduled",
  "on_the_way",
  "in_progress",
  "completed",
  "report_sent",
  "invoiced",
  "paid",
  "cancelled",
  "on_hold",
  "follow_up_required",
]);

export const jobType = pgEnum("job_type", [
  "regular_pool_service",
  "one_off_pool_service",
  "green_pool_recovery",
  "pool_inspection",
  "equipment_repair",
  "pump_repair",
  "pump_replacement",
  "chlorinator_repair",
  "chlorinator_replacement",
  "filter_service",
  "filter_media_change",
  "heater_service",
  "leak_investigation",
  "handover_service",
  "quote_visit",
  "warranty_visit",
  "emergency_service",
  "water_test_only",
  "commercial_service",
  "rental_property_inspection",
  "pool_clean_up",
  "debris_removal",
  "system_check",
  "customer_requested_work",
]);

export const visitStatus = pgEnum("visit_status", [
  "scheduled",
  "on_the_way",
  "in_progress",
  "completed",
  "cancelled",
  "missed",
]);

export const recurrenceFrequency = pgEnum("recurrence_frequency", [
  "weekly",
  "fortnightly",
  "monthly",
  "seasonal",
  "custom",
]);

export const quoteStatus = pgEnum("quote_status", [
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
  "converted",
]);

export const invoiceStatus = pgEnum("invoice_status", [
  "draft",
  "sent",
  "partially_paid",
  "paid",
  "overdue",
  "void",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "received",
  "failed",
  "refunded",
]);

export const reportType = pgEnum("report_type", [
  "service_report",
  "pool_inspection_report",
  "water_test_report",
]);

export const reportStatus = pgEnum("report_status", [
  "draft",
  "ready",
  "sent",
  "archived",
]);

export const attachmentKind = pgEnum("attachment_kind", [
  "before_photo",
  "after_photo",
  "equipment_photo",
  "damage_photo",
  "green_pool_photo",
  "water_condition_photo",
  "safety_issue_photo",
  "repair_evidence_photo",
  "completed_work_photo",
  "approval",
  "terms",
  "customer_document",
  "inspection_report",
  "invoice",
  "quote",
  "warranty",
  "manual",
]);

export const messageChannel = pgEnum("message_channel", [
  "email",
  "sms",
  "portal",
  "internal",
]);

export const routeStatus = pgEnum("route_status", [
  "draft",
  "ready_to_optimise",
  "optimised",
  "sent_to_technician",
  "completed",
]);

export const integrationProvider = pgEnum("integration_provider", [
  "xero",
  "stripe",
  "sms",
  "email",
  "graphhopper",
  "lamotte_spintouch",
  "supplier",
]);

export const stockMovementType = pgEnum("stock_movement_type", [
  "adjustment",
  "transfer",
  "job_usage",
  "reorder",
  "receive",
]);

export const organisations = pgTable("organisations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  tradingName: text("trading_name"),
  email: text("email"),
  phone: text("phone"),
  abn: text("abn"),
  defaultTimezone: text("default_timezone").notNull().default("Australia/Darwin"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  defaultRole: appRole("default_role").notNull().default("technician"),
  activeOrganisationId: uuid("active_organisation_id").references(
    () => organisations.id,
  ),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").references(() => organisations.id, {
    onDelete: "cascade",
  }),
  key: appRole("key").notNull(),
  name: text("name").notNull(),
  description: text("description"),
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  description: text("description"),
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    organisationId: uuid("organisation_id")
      .notNull()
      .references(() => organisations.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId, table.organisationId] }),
  }),
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  }),
);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  displayName: text("display_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  customerType: customerType("customer_type").notNull().default("residential"),
  billingAddress: text("billing_address"),
  invoiceTerms: text("invoice_terms"),
  preferredServiceDay: text("preferred_service_day"),
  communicationPreferences: text("communication_preferences"),
  realEstateAgencyDetails: text("real_estate_agency_details"),
  propertyManagerDetails: text("property_manager_details"),
  ownerDetails: text("owner_details"),
  tenantDetails: text("tenant_details"),
  internalNotes: text("internal_notes"),
  portalEnabled: boolean("portal_enabled").notNull().default(false),
  portalUserId: text("portal_user_id").references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const sites = pgTable("sites", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  name: text("name").notNull(),
  addressLine1: text("address_line_1").notNull(),
  suburb: text("suburb").notNull().default("Alice Springs"),
  state: text("state").notNull().default("NT"),
  postcode: text("postcode").notNull().default("0870"),
  gateCode: text("gate_code"),
  accessNotes: text("access_notes"),
  accessWarning: text("access_warning"),
  petWarnings: text("pet_warnings"),
  tenantDetails: text("tenant_details"),
  ownerAgentDetails: text("owner_agent_details"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isActive: boolean("is_active").notNull().default(true),
});

export const pools = pgTable("pools", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id),
  name: text("name").notNull().default("Main pool"),
  volumeLitres: integer("volume_litres"),
  poolType: text("pool_type"),
  surfaceType: text("surface_type"),
  sanitiserType: text("sanitiser_type"),
  environment: text("environment"),
  heaterInformation: text("heater_information"),
  spaInformation: text("spa_information"),
  normalChemicalBehaviour: text("normal_chemical_behaviour"),
  targetRanges: jsonb("target_ranges").$type<Record<string, unknown>>(),
  serviceNotes: text("service_notes"),
  isActive: boolean("is_active").notNull().default(true),
});

export const equipment = pgTable("equipment", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  siteId: uuid("site_id").references(() => sites.id),
  poolId: uuid("pool_id").references(() => pools.id),
  equipmentType: text("equipment_type").notNull(),
  brand: text("brand"),
  model: text("model"),
  serialNumber: text("serial_number"),
  installedOn: date("installed_on"),
  warrantyExpiresOn: date("warranty_expires_on"),
  conditionNotes: text("condition_notes"),
  repairHistory: text("repair_history"),
  replacementRecommendation: text("replacement_recommendation"),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id),
  poolId: uuid("pool_id").references(() => pools.id),
  assignedToUserId: text("assigned_to_user_id").references(() => users.id),
  jobNumber: text("job_number").notNull().unique(),
  title: text("title").notNull(),
  jobType: jobType("job_type").notNull().default("regular_pool_service"),
  status: jobStatus("status").notNull().default("new"),
  priority: text("priority").notNull().default("normal"),
  scheduledStart: timestamp("scheduled_start", { mode: "date" }),
  scheduledEnd: timestamp("scheduled_end", { mode: "date" }),
  estimatedDurationMinutes: integer("estimated_duration_minutes"),
  internalNotes: text("internal_notes"),
  customerNotes: text("customer_notes"),
  technicianNotes: text("technician_notes"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const visits = pgTable("visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id),
  technicianUserId: text("technician_user_id").references(() => users.id),
  status: visitStatus("status").notNull().default("scheduled"),
  scheduledStart: timestamp("scheduled_start", { mode: "date" }),
  scheduledEnd: timestamp("scheduled_end", { mode: "date" }),
  onTheWayAt: timestamp("on_the_way_at", { mode: "date" }),
  startedAt: timestamp("started_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  routeOrder: integer("route_order"),
});

export const recurringJobs = pgTable("recurring_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  siteId: uuid("site_id")
    .notNull()
    .references(() => sites.id),
  poolId: uuid("pool_id").references(() => pools.id),
  assignedToUserId: text("assigned_to_user_id").references(() => users.id),
  frequency: recurrenceFrequency("frequency").notNull(),
  preferredServiceDay: text("preferred_service_day"),
  preferredTimeWindow: text("preferred_time_window"),
  startsOn: date("starts_on").notNull(),
  endsOn: date("ends_on"),
  nextServiceOn: date("next_service_on"),
  isActive: boolean("is_active").notNull().default(true),
});

export const waterTests = pgTable("water_tests", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  jobId: uuid("job_id").references(() => jobs.id),
  visitId: uuid("visit_id").references(() => visits.id),
  poolId: uuid("pool_id")
    .notNull()
    .references(() => pools.id),
  technicianUserId: text("technician_user_id").references(() => users.id),
  freeChlorine: real("free_chlorine"),
  totalChlorine: real("total_chlorine"),
  combinedChlorine: real("combined_chlorine"),
  ph: real("ph"),
  totalAlkalinity: real("total_alkalinity"),
  calciumHardness: real("calcium_hardness"),
  cyanuricAcid: real("cyanuric_acid"),
  salt: real("salt"),
  phosphate: real("phosphate"),
  tds: real("tds"),
  waterTemperature: real("water_temperature"),
  copper: real("copper"),
  iron: real("iron"),
  borates: real("borates"),
  nitrates: real("nitrates"),
  source: text("source").notNull().default("manual"),
  alertStatus: text("alert_status"),
  notes: text("notes"),
  testedAt: timestamp("tested_at", { mode: "date" }).notNull().defaultNow(),
});

export const chemicalProducts = pgTable("chemical_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id").references(() => organisations.id),
  name: text("name").notNull(),
  brand: text("brand").notNull().default("BioGuard Australia"),
  category: text("category").notNull(),
  purpose: text("purpose"),
  unitType: text("unit_type").notNull(),
  productStrength: text("product_strength"),
  dosingNotes: text("dosing_notes"),
  applicationMethod: text("application_method"),
  safetyNotes: text("safety_notes"),
  relatedWaterIssues: jsonb("related_water_issues").$type<string[]>(),
  isActive: boolean("is_active").notNull().default(true),
});

export const stock = pgTable("stock", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => chemicalProducts.id),
  vanUserId: text("van_user_id").references(() => users.id),
  locationName: text("location_name").notNull(),
  quantityOnHand: real("quantity_on_hand").notNull().default(0),
  unit: text("unit").notNull(),
  unitCostCents: integer("unit_cost_cents"),
  sellingPriceCents: integer("selling_price_cents"),
  lowStockThreshold: real("low_stock_threshold").notNull().default(0),
  supplier: text("supplier"),
});

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  stockId: uuid("stock_id")
    .notNull()
    .references(() => stock.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => chemicalProducts.id),
  jobId: uuid("job_id").references(() => jobs.id),
  visitId: uuid("visit_id").references(() => visits.id),
  movementType: stockMovementType("movement_type").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  siteId: uuid("site_id").references(() => sites.id),
  jobId: uuid("job_id").references(() => jobs.id),
  quoteNumber: text("quote_number").notNull().unique(),
  title: text("title").notNull(),
  status: quoteStatus("status").notNull().default("draft"),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  gstCents: integer("gst_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  issuedAt: timestamp("issued_at", { mode: "date" }),
  validUntil: date("valid_until"),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
  terms: text("terms"),
});

export const quoteLineItems = pgTable("quote_line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(),
  description: text("description").notNull(),
  quantity: real("quantity").notNull().default(1),
  unitPriceCents: integer("unit_price_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  siteId: uuid("site_id").references(() => sites.id),
  jobId: uuid("job_id").references(() => jobs.id),
  quoteId: uuid("quote_id").references(() => quotes.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  status: invoiceStatus("status").notNull().default("draft"),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  gstCents: integer("gst_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  issuedAt: timestamp("issued_at", { mode: "date" }),
  dueAt: timestamp("due_at", { mode: "date" }),
  xeroSyncStatus: text("xero_sync_status").notNull().default("not_synced"),
});

export const invoiceLineItems = pgTable("invoice_line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(),
  description: text("description").notNull(),
  quantity: real("quantity").notNull().default(1),
  unitPriceCents: integer("unit_price_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id),
  amountCents: integer("amount_cents").notNull(),
  status: paymentStatus("status").notNull().default("pending"),
  method: text("method"),
  providerReference: text("provider_reference"),
  receivedAt: timestamp("received_at", { mode: "date" }),
});

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  siteId: uuid("site_id").references(() => sites.id),
  poolId: uuid("pool_id").references(() => pools.id),
  jobId: uuid("job_id").references(() => jobs.id),
  visitId: uuid("visit_id").references(() => visits.id),
  waterTestId: uuid("water_test_id").references(() => waterTests.id),
  reportNumber: text("report_number").notNull().unique(),
  reportType: reportType("report_type").notNull(),
  status: reportStatus("status").notNull().default("draft"),
  summary: text("summary"),
  findings: text("findings"),
  recommendations: text("recommendations"),
  sentAt: timestamp("sent_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id").references(() => customers.id),
  siteId: uuid("site_id").references(() => sites.id),
  poolId: uuid("pool_id").references(() => pools.id),
  jobId: uuid("job_id").references(() => jobs.id),
  visitId: uuid("visit_id").references(() => visits.id),
  reportId: uuid("report_id").references(() => reports.id),
  equipmentId: uuid("equipment_id").references(() => equipment.id),
  kind: attachmentKind("kind").notNull(),
  label: text("label").notNull(),
  storageKey: text("storage_key").notNull(),
  contentType: text("content_type"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  customerId: uuid("customer_id").references(() => customers.id),
  jobId: uuid("job_id").references(() => jobs.id),
  invoiceId: uuid("invoice_id").references(() => invoices.id),
  quoteId: uuid("quote_id").references(() => quotes.id),
  channel: messageChannel("channel").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  sentByUserId: text("sent_by_user_id").references(() => users.id),
  sentAt: timestamp("sent_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export const routes = pgTable("routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  technicianUserId: text("technician_user_id").references(() => users.id),
  routeDate: date("route_date").notNull(),
  startingLocation: text("starting_location"),
  startingLatitude: real("starting_latitude"),
  startingLongitude: real("starting_longitude"),
  status: routeStatus("status").notNull().default("draft"),
  provider: text("provider").notNull().default("mock"),
  currentDistanceMetres: integer("current_distance_metres"),
  currentTravelSeconds: integer("current_travel_seconds"),
  optimisedDistanceMetres: integer("optimised_distance_metres"),
  optimisedTravelSeconds: integer("optimised_travel_seconds"),
  optimisationPayload: jsonb("optimisation_payload").$type<Record<string, unknown>>(),
});

export const routeStops = pgTable("route_stops", {
  id: uuid("id").primaryKey().defaultRandom(),
  routeId: uuid("route_id")
    .notNull()
    .references(() => routes.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id),
  siteId: uuid("site_id").references(() => sites.id),
  stopOrder: integer("stop_order").notNull(),
  estimatedTravelSeconds: integer("estimated_travel_seconds"),
  estimatedServiceMinutes: integer("estimated_service_minutes"),
  latitude: real("latitude"),
  longitude: real("longitude"),
});

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organisationId: uuid("organisation_id")
    .notNull()
    .references(() => organisations.id),
  provider: integrationProvider("provider").notNull(),
  displayName: text("display_name").notNull(),
  status: text("status").notNull().default("planned"),
  externalAccountId: text("external_account_id"),
  settings: jsonb("settings").$type<Record<string, unknown>>(),
  connectedAt: timestamp("connected_at", { mode: "date" }),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const organisationRelations = relations(organisations, ({ many }) => ({
  customers: many(customers),
  users: many(users),
  sites: many(sites),
  jobs: many(jobs),
  integrations: many(integrations),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  activeOrganisation: one(organisations, {
    fields: [users.activeOrganisationId],
    references: [organisations.id],
  }),
  accounts: many(accounts),
  sessions: many(sessions),
  assignedJobs: many(jobs),
  visits: many(visits),
  routes: many(routes),
  roles: many(userRoles),
}));

export const customerRelations = relations(customers, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [customers.organisationId],
    references: [organisations.id],
  }),
  portalUser: one(users, {
    fields: [customers.portalUserId],
    references: [users.id],
  }),
  sites: many(sites),
  jobs: many(jobs),
  quotes: many(quotes),
  invoices: many(invoices),
  reports: many(reports),
}));

export const siteRelations = relations(sites, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [sites.organisationId],
    references: [organisations.id],
  }),
  customer: one(customers, {
    fields: [sites.customerId],
    references: [customers.id],
  }),
  pools: many(pools),
  equipment: many(equipment),
  jobs: many(jobs),
}));

export const poolRelations = relations(pools, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [pools.organisationId],
    references: [organisations.id],
  }),
  site: one(sites, {
    fields: [pools.siteId],
    references: [sites.id],
  }),
  equipment: many(equipment),
  waterTests: many(waterTests),
}));

export const jobRelations = relations(jobs, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [jobs.organisationId],
    references: [organisations.id],
  }),
  customer: one(customers, {
    fields: [jobs.customerId],
    references: [customers.id],
  }),
  site: one(sites, {
    fields: [jobs.siteId],
    references: [sites.id],
  }),
  pool: one(pools, {
    fields: [jobs.poolId],
    references: [pools.id],
  }),
  assignedTo: one(users, {
    fields: [jobs.assignedToUserId],
    references: [users.id],
  }),
  visits: many(visits),
  waterTests: many(waterTests),
  reports: many(reports),
  stockMovements: many(stockMovements),
}));

export const visitRelations = relations(visits, ({ one }) => ({
  organisation: one(organisations, {
    fields: [visits.organisationId],
    references: [organisations.id],
  }),
  job: one(jobs, {
    fields: [visits.jobId],
    references: [jobs.id],
  }),
  technician: one(users, {
    fields: [visits.technicianUserId],
    references: [users.id],
  }),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [invoices.organisationId],
    references: [organisations.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  job: one(jobs, {
    fields: [invoices.jobId],
    references: [jobs.id],
  }),
  lineItems: many(invoiceLineItems),
  payments: many(payments),
}));

export const routeRelations = relations(routes, ({ one, many }) => ({
  organisation: one(organisations, {
    fields: [routes.organisationId],
    references: [organisations.id],
  }),
  technician: one(users, {
    fields: [routes.technicianUserId],
    references: [users.id],
  }),
  stops: many(routeStops),
}));
