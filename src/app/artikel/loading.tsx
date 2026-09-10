export default function Loading() {
  return (
    <div className="mx-auto max-w-site px-4 py-20 md:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl">
        <div className="h-5 w-32 rounded-full bg-surface-low" />
        <div className="mt-4 h-[56px] w-3/4 rounded-lg bg-surface-low" />
        <div className="mt-3 h-6 w-full rounded bg-surface-low" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-card bg-white p-5">
            <div className="aspect-[4/3] rounded-DEFAULT bg-surface-low" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-1/3 rounded bg-surface-low" />
              <div className="h-5 w-3/4 rounded bg-surface-low" />
              <div className="h-3 w-1/2 rounded bg-surface-low" />
              <div className="mt-4 h-9 w-full rounded-DEFAULT bg-surface-low" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
