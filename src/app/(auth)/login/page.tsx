export default function LoginPage() {
  const demoRole = process.env.CLEARWATER_DEMO_ROLE ?? "owner";
  const authEnforced = process.env.CLEARWATER_ENFORCE_AUTH === "true";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          ClearWater
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Log in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Auth.js is wired into the project. Login enforcement is currently{" "}
          <span className="font-semibold text-slate-950">
            {authEnforced ? "on" : "off"}
          </span>{" "}
          so the MVP remains accessible while roles are tested.
        </p>
        <div className="mt-5 rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
          Demo role: <span className="font-bold">{demoRole}</span>. Set
          `CLEARWATER_DEMO_ROLE` to owner, admin, dispatcher, technician,
          finance, or customer while testing permissions.
        </div>
      </section>
    </main>
  );
}
