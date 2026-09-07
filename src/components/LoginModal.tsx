import { useEffect, useId, useState, type FormEvent } from 'react'
import { ApartmentSelect } from './ApartmentSelect'

type LoginModalProps = {
  apartments: string[]
  onClose: () => void
  onLogin: (apartment: string, password: string) => Promise<void>
}

export function LoginModal({ apartments, onClose, onLogin }: LoginModalProps) {
  const titleId = useId()
  const [apartment, setApartment] = useState(apartments[0] ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await onLogin(apartment, password)
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : 'Innlogging feilet',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_24px_60px_-28px_rgba(40,28,18,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="text-lg font-semibold tracking-tight text-ink">
          Logg inn
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Velg leilighet og skriv inn passord for å reservere vasketid.
        </p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <ApartmentSelect
            apartments={apartments}
            value={apartment}
            onChange={setApartment}
          />

          <label className="flex min-w-44 flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-moss-ink/55">
              Passord
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium text-ink shadow-sm outline-none transition hover:border-moss/40 focus:border-moss focus:ring-2 focus:ring-moss/20"
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          ) : null}

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg border border-ink/15 bg-white px-4 text-sm font-medium text-ink transition hover:border-ink/30"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting || !apartment || !password}
              className="h-10 flex-1 rounded-lg bg-moss px-4 text-sm font-medium text-white transition hover:bg-moss/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Logger inn…' : 'Logg inn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
