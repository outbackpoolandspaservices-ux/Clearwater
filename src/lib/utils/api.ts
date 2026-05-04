export function notImplemented(feature: string) {
  return Response.json(
    {
      feature,
      status: "planned",
      message: `${feature} API is scaffolded and ready for implementation.`,
    },
    { status: 501 },
  );
}
