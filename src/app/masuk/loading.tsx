export default function Loading() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="batik-bg-pattern hidden flex-col justify-center p-14 text-white lg:flex">
        <div className="h-8 w-56 rounded bg-white/10" />
        <div className="mt-10 h-16 w-3/4 rounded bg-white/10" />
        <div className="mt-6 h-20 w-2/3 rounded bg-white/10" />
        <div className="mt-10 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-48 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col justify-center bg-white px-4 py-12 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-md space-y-5">
          <div className="h-5 w-48 rounded bg-surface-low" />
          <div className="h-8 w-3/4 rounded bg-surface-low" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 rounded-DEFAULT bg-surface-low" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 rounded-DEFAULT bg-surface-low" />
          ))}
          <div className="h-14 rounded-DEFAULT bg-surface-low" />
        </div>
      </section>
    </main>
  );
}
