export default function ClinicsLoading() {
  return (
    <section className="container-custom py-8 sm:py-12">
      {/* header placeholder */}
      <div className="mb-8 h-32 animate-pulse rounded-3xl gradient-primary opacity-60" />

      {/* filters placeholder */}
      <div className="mb-8 grid animate-pulse gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3">
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
        <div className="h-11 rounded-xl bg-slate-100" />
      </div>

      {/* cards placeholder */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="animate-pulse rounded-2xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="h-14 w-14 rounded-2xl bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 h-5 w-2/3 rounded bg-slate-100" />
            <div className="mt-2 h-4 w-full rounded bg-slate-100" />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="h-9 rounded-xl bg-slate-100" />
              <div className="h-9 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-5 h-10 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
