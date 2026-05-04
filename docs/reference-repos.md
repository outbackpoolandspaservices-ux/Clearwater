# Reference Repositories

These repositories are architectural references only. They are not code sources for ClearWater.

ClearWater may also draw product inspiration from PoolTrackr, ServiceM8, Skimmer, Pool Brain, Jobber, and Housecall Pro. Treat those as product pattern references, not code references.

## vercel/nextjs-postgres-auth-starter

Use as inspiration for:

- Next.js App Router project shape.
- Auth.js integration with PostgreSQL-backed sessions.
- Drizzle ORM migration workflow.
- Vercel-friendly environment variable setup.

Avoid copying:

- Exact schema, UI, naming, or business logic.

## jquense/react-big-calendar

Use as inspiration for:

- Dispatch calendar concepts.
- Drag-and-drop scheduling behavior.
- Views such as day, week, agenda, and technician workload timelines.

Avoid copying:

- Internal implementation details beyond normal library usage.

## TanStack/table

Use as inspiration for:

- Reusable, typed data grid architecture.
- Sorting, filtering, pagination, visibility, and row selection patterns.
- Headless table logic separated from ClearWater styling.

Avoid copying:

- Example table components without adapting them to this product.

## graphhopper/graphhopper

Use as inspiration for:

- Routing concepts such as travel time, waypoints, constraints, and optimisation.
- Separating route calculation from dispatch UI.
- Thinking about technician capacity across long service runs around Alice Springs.

Avoid copying:

- Java implementation details or routing engine internals.
