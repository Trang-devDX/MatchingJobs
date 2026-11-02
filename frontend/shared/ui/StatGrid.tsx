export function StatGrid({ items }: { items: { key: string; label: string; value: number }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.key} className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-muted">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{item.value.toLocaleString()}</p>
        </article>
      ))}
    </div>
  )
}
