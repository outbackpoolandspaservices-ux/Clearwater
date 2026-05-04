type DetailCardProps = {
  title: string;
  children: React.ReactNode;
};

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type DetailListProps = {
  items: Array<{
    label: string;
    value: React.ReactNode;
  }>;
};

export function DetailList({ items }: DetailListProps) {
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="font-medium text-slate-500">{item.label}</dt>
          <dd className="mt-1 text-slate-950">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
