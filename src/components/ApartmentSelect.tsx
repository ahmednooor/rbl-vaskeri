type ApartmentSelectProps = {
  apartments: string[]
  value: string
  onChange: (apartmentId: string) => void
}

export function ApartmentSelect({
  apartments,
  value,
  onChange,
}: ApartmentSelectProps) {
  return (
    <label className="flex min-w-44 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-ink/55">
        Leilighet
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none transition hover:border-moss/40 focus:border-moss focus:ring-2 focus:ring-moss/20"
      >
        {apartments.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </label>
  )
}
