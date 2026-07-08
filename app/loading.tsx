export default function Loading() {
  return (
    <section className="container-custom py-12 sm:py-16">
      <div className="mb-8 h-32 animate-pulse rounded-3xl gradient-primary opacity-50" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="animate-pulse rounded-2xl border border-line bg-white p-6">
            <div className="h-14 w-14 rounded-2xl bg-slate-100" />
            <div className="mt-4 h-5 w-2/3 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            <div className="mt-5 h-10 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
