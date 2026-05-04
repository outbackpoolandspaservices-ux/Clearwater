type SearchFilterBarProps = {
  searchPlaceholder: string;
  filterLabel: string;
  filterOptions: string[];
  actionLabel?: string;
};

export function SearchFilterBar({
  searchPlaceholder,
  filterLabel,
  filterOptions,
  actionLabel,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search"
          className="min-h-10 flex-1 rounded-md border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          placeholder={searchPlaceholder}
          type="search"
        />
        <label className="sr-only" htmlFor="list-filter">
          {filterLabel}
        </label>
        <select
          className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          defaultValue=""
          id="list-filter"
        >
          <option value="">{filterLabel}</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {actionLabel ? (
        <button
          className="min-h-10 rounded-md bg-cyan-600 px-4 text-sm font-semibold text-white hover:bg-cyan-700"
          type="button"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
