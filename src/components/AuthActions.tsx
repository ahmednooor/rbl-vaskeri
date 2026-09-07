import type { SaveStatus } from '../types'

type HeaderButtonProps = {
  children: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

function HeaderButton({
  children,
  onClick,
  disabled = false,
  variant = 'secondary',
}: HeaderButtonProps) {
  const styles =
    variant === 'primary'
      ? 'bg-moss text-white hover:bg-moss/90'
      : 'border border-ink/15 bg-white text-ink hover:border-ink/30'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-10 rounded-lg px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
    >
      {children}
    </button>
  )
}

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  booked: 'Reservasjonen er lagret',
  cleared: 'Reservasjonen er avbestilt',
}

type AuthActionsProps = {
  isLoggedIn: boolean
  apartment?: string
  saving?: boolean
  saveStatus?: SaveStatus | null
  onLogin: () => void
  onLogout: () => void
  onSave: () => void
}

export function AuthActions({
  isLoggedIn,
  apartment,
  saving = false,
  saveStatus = null,
  onLogin,
  onLogout,
  onSave,
}: AuthActionsProps) {
  if (!isLoggedIn) {
    return <HeaderButton onClick={onLogin}>Logg inn</HeaderButton>
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {apartment ? (
          <p className="mr-1 text-sm font-medium text-ink/70">{apartment}</p>
        ) : null}
        <HeaderButton onClick={onLogout}>Logg ut</HeaderButton>
        <HeaderButton variant="primary" onClick={onSave} disabled={saving}>
          {saving ? 'Lagrer…' : 'Lagre'}
        </HeaderButton>
      </div>
      {saveStatus ? (
        <p className="text-sm font-medium text-moss">{SAVE_STATUS_LABEL[saveStatus]}</p>
      ) : null}
    </div>
  )
}
