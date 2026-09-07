export function Legend({ month }: { month: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-ink/70">
      <p className="text-xl font-semibold tracking-tight text-ink">{month}</p>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <LegendItem swatch="bg-white border-ink/20" label="Ledig" />
        <LegendItem swatch="bg-moss text-white border-ink/20" label="Din reservasjon" />
        <LegendItem swatch="bg-reserved text-ink border-ink/20" label="Opptatt" />
      </ul>
    </div>
  )
}

function LegendItem({
  swatch,
  label,
  sample = '',
}: {
  swatch: string
  label: string
  sample?: string
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className={`grid h-6 w-8 place-items-center rounded-sm border border-ink/10 text-[10px] font-semibold ${swatch}`}
      >
        {sample}
      </span>
      {label}
    </li>
  )
}
