export function isDatabaseDataSourceEnabled() {
  return (
    process.env.CLEARWATER_DATA_SOURCE === "database" &&
    Boolean(process.env.DATABASE_URL)
  );
}

export function getDataSourceLabel() {
  return isDatabaseDataSourceEnabled() ? "database" : "mock";
}
