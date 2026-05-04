import { seedIds } from "./ids";

export const userSeeds = [
  {
    id: seedIds.users.owner,
    name: "Mia Owner",
    email: "owner@outbackpoolspa.example",
    defaultRole: "owner" as const,
    activeOrganisationId: seedIds.organisation,
  },
  {
    id: seedIds.users.dispatcher,
    name: "Alex Dispatcher",
    email: "dispatch@outbackpoolspa.example",
    defaultRole: "dispatcher" as const,
    activeOrganisationId: seedIds.organisation,
  },
  {
    id: seedIds.users.technicianSam,
    name: "Sam",
    email: "sam@outbackpoolspa.example",
    defaultRole: "technician" as const,
    activeOrganisationId: seedIds.organisation,
  },
  {
    id: seedIds.users.technicianJordan,
    name: "Jordan",
    email: "jordan@outbackpoolspa.example",
    defaultRole: "technician" as const,
    activeOrganisationId: seedIds.organisation,
  },
  {
    id: seedIds.users.finance,
    name: "Casey Finance",
    email: "finance@outbackpoolspa.example",
    defaultRole: "finance" as const,
    activeOrganisationId: seedIds.organisation,
  },
  {
    id: seedIds.users.customerFlynn,
    name: "Mia Flynn",
    email: "flynn.family@example.com",
    defaultRole: "customer" as const,
    activeOrganisationId: seedIds.organisation,
  },
];

export const roleSeeds = [
  {
    id: seedIds.roles.owner,
    organisationId: seedIds.organisation,
    key: "owner" as const,
    name: "Owner",
    description: "Full access to ClearWater settings and business workflows.",
  },
  {
    id: seedIds.roles.admin,
    organisationId: seedIds.organisation,
    key: "admin" as const,
    name: "Admin",
    description: "Operational administration access.",
  },
  {
    id: seedIds.roles.dispatcher,
    organisationId: seedIds.organisation,
    key: "dispatcher" as const,
    name: "Dispatcher",
    description: "Scheduling, customers, jobs, and dispatch access.",
  },
  {
    id: seedIds.roles.technician,
    organisationId: seedIds.organisation,
    key: "technician" as const,
    name: "Technician",
    description: "Mobile job, water test, and field workflow access.",
  },
  {
    id: seedIds.roles.finance,
    organisationId: seedIds.organisation,
    key: "finance" as const,
    name: "Finance",
    description: "Invoices, payments, quotes, and reporting access.",
  },
  {
    id: seedIds.roles.customer,
    organisationId: seedIds.organisation,
    key: "customer" as const,
    name: "Customer",
    description: "Customer portal access.",
  },
];

export const userRoleSeeds = [
  {
    userId: seedIds.users.owner,
    roleId: seedIds.roles.owner,
    organisationId: seedIds.organisation,
  },
  {
    userId: seedIds.users.dispatcher,
    roleId: seedIds.roles.dispatcher,
    organisationId: seedIds.organisation,
  },
  {
    userId: seedIds.users.technicianSam,
    roleId: seedIds.roles.technician,
    organisationId: seedIds.organisation,
  },
  {
    userId: seedIds.users.technicianJordan,
    roleId: seedIds.roles.technician,
    organisationId: seedIds.organisation,
  },
  {
    userId: seedIds.users.finance,
    roleId: seedIds.roles.finance,
    organisationId: seedIds.organisation,
  },
  {
    userId: seedIds.users.customerFlynn,
    roleId: seedIds.roles.customer,
    organisationId: seedIds.organisation,
  },
];
