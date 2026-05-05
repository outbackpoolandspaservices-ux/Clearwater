# Authentication And Permissions

ClearWater is prepared for Auth.js, PostgreSQL, Drizzle, and role-based access control. Real login is not enforced yet so the current mock-data demo remains easy to review.

## Auth Foundation

Auth.js is wired through:

- `src/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth/config.ts`
- `src/db/schema.ts`

The Auth.js provider list is intentionally empty for now. A future step can choose email magic links, credentials, Google, Microsoft, or another provider without reshaping the app.

Current-user and guard helpers now live in:

- `src/lib/auth/current-user.ts`
- `src/lib/auth/guards.ts`

These helpers return the real Auth.js session user when one exists. If no session exists and `CLEARWATER_ENFORCE_AUTH` is not `true`, they return a safe demo user using `CLEARWATER_DEMO_ROLE`.

## Planned Roles

ClearWater roles are:

- `owner`
- `admin`
- `dispatcher`
- `technician`
- `finance`
- `customer`

Placeholder RBAC helpers live in `src/lib/rbac/roles.ts`.

## Planned Route Groups

Route access planning lives in `src/lib/auth/route-access.ts`.

- Staff/admin app routes: `/(app)` pages such as dashboard, customers, jobs, dispatch, reports, stock, and settings.
- Technician routes: `/technician` and `/technician/today`.
- Customer portal routes: `/portal`, `/portal/jobs`, `/portal/reports`, `/portal/quotes`, and `/portal/invoices`.

These helpers are not globally enforced yet. That is intentional for this phase so the deployed MVP stays reviewable.

## Safe Demo Mode

Use these variables while testing:

- `CLEARWATER_ENFORCE_AUTH="false"` keeps the app accessible and returns a demo user.
- `CLEARWATER_DEMO_ROLE="owner"` controls the demo role. Valid values are `owner`, `admin`, `dispatcher`, `technician`, `finance`, and `customer`.

Only set `CLEARWATER_ENFORCE_AUTH="true"` after a real provider, seeded users, and role loading have been tested in Vercel.

## Future Enforcement Steps

1. Add the chosen Auth.js provider.
2. Seed an organisation, admin user, roles, and permissions.
3. Add session role loading.
4. Add middleware or layout-level guards for route groups.
5. Add customer portal session checks.
6. Keep a demo-safe mode or seeded demo account for visual review.

## Important Safety Note

The current app still uses mock data for UI workflows. Authentication and database work should not remove `src/lib/mock-data.ts` until each workflow has been migrated, tested, and reviewed.
