export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
          ClearWater
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Log in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Auth.js is wired into the project. Provider and credential choices
          will be added when the authentication workflow is implemented.
        </p>
      </section>
    </main>
  );
}
