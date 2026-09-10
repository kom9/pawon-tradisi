export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <div className="flex">
        <aside className="hidden h-screen w-72 border-r border-outline-editorial bg-white lg:block">
          <div className="border-b border-outline-editorial p-6">
            <div className="h-11 w-40 rounded bg-surface-low" />
            <div className="mt-5 h-10 rounded-DEFAULT bg-surface-low" />
          </div>
          <div className="space-y-1 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-DEFAULT bg-surface-low" />
            ))}
          </div>
        </aside>
        <div className="flex w-full flex-col lg:ml-72">
          <div className="border-b border-outline-editorial px-6 py-4">
            <div className="h-5 w-64 rounded bg-surface-low" />
            <div className="mt-2 h-4 w-80 rounded bg-surface-low" />
          </div>
          <main className="space-y-6 p-6 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-card bg-white p-5">
                  <div className="h-4 w-2/3 rounded bg-surface-low" />
                  <div className="mt-2 h-8 w-1/2 rounded bg-surface-low" />
                  <div className="mt-1 h-3 w-3/4 rounded bg-surface-low" />
                </div>
              ))}
            </div>
            <div className="rounded-card bg-white p-5">
              <div className="mb-4 flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 w-24 rounded-full bg-surface-low" />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 border-b border-outline-editorial" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
