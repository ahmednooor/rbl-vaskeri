export function Loader({ label = 'Laster kalender…' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-ink/15 border-t-moss"
        aria-hidden="true"
      />
      <p className="text-sm text-ink/55">{label}</p>
    </div>
  )
}
