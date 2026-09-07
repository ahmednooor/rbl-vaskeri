import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthActions } from './components/AuthActions'
import { Legend } from './components/Legend'
import { Loader } from './components/Loader'
import { LoginModal } from './components/LoginModal'
import { MachineGroupTable } from './components/MachineGroupTable'
import { MACHINE_GROUPS, TIME_SLOTS } from './data/schedule'
import { bookingFacade } from './services/booking'
import type { AuthSession, BookingState, CellStatus, MachineGroupId, SaveBooking, SaveStatus } from './types'
import { findUserBooking, toggleBooking } from './utils/bookings'
import { getDayColumns, monthLabel } from './utils/calendar'

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const CURRENT_MONTH = now.getMonth() + 1

function App() {
  const [booking, setBooking] = useState<BookingState | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus | null>(null)
  const [pendingBooking, setPendingBooking] = useState<SaveBooking | null>(null)
  const [error, setError] = useState<string | null>(null)
  const days = useMemo(
    () => getDayColumns(CURRENT_YEAR, CURRENT_MONTH),
    [],
  )

  const refreshCalendars = useCallback(async () => {
    const data = await bookingFacade.getAllData()
    setBooking(data)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setError(null)
      try {
        await refreshCalendars()
      } catch (loadError) {
        if (cancelled) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Kunne ikke hente data',
        )
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [refreshCalendars])

  function handleToggle(
    groupId: MachineGroupId,
    day: number,
    slotIndex: number,
    status: CellStatus,
  ) {
    if (!session || !booking) return
    setSaveStatus(null)
    const calendar = toggleBooking(
      booking.calendar,
      groupId,
      slotIndex,
      day,
      session.apartment,
      status,
    )
    setPendingBooking(findUserBooking(calendar, session.apartment))
    setBooking({ ...booking, calendar })
  }

  async function handleLogin(apartment: string, password: string) {
    await bookingFacade.login(apartment, password)
    setSession({ apartment, password })
    setLoginOpen(false)
    setError(null)
    setSaveStatus(null)
    setPendingBooking(null)
  }

  async function handleLogout() {
    setSession(null)
    setSaveStatus(null)
    setError(null)
    setPendingBooking(null)
    try {
      await refreshCalendars()
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Kunne ikke hente data',
      )
    }
  }

  async function handleSave() {
    if (!session || !booking) return
    setSaving(true)
    setError(null)
    setSaveStatus(null)
    const bookingToSave = pendingBooking
    try {
      const status = await bookingFacade.save(session, bookingToSave)
      setSaveStatus(status)
      await refreshCalendars()
    } catch (saveError) {
      setSaveStatus(null)
      setError(
        saveError instanceof Error ? saveError.message : 'Lagring feilet',
      )
      try {
        await refreshCalendars()
      } catch {
        // Keep the save error; calendars will stay as they are if refetch also fails.
      }
    } finally {
      setPendingBooking(null)
      setSaving(false)
    }
  }

  const loading = booking === null && error === null
  const selectedApartmentId = session?.apartment ?? ''

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(1200px_280px_at_50%_-40px,rgba(15,107,92,0.12),transparent_70%)]" />

      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">
              Rødtvet Borettslag · Vaskeri
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Bestilling av vasketid
            </h1>
            <p className="mt-1 max-w-xl text-sm text-ink/60">
              {session
                ? 'Klikk på et ledig felt for å reservere. Du kan bare ha én reservasjon om gangen. Klikk din reservasjon for å avbestille.'
                : 'Logg inn for å reservere vasketid.'}
            </p>
          </div>

          {booking ? (
            <AuthActions
              isLoggedIn={session !== null}
              apartment={session?.apartment}
              saving={saving}
              saveStatus={saveStatus}
              onLogin={() => setLoginOpen(true)}
              onLogout={() => {
                void handleLogout()
              }}
              onSave={() => {
                void handleSave()
              }}
            />
          ) : null}
        </div>
      </header>

      <main className="relative mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        {loading ? <Loader /> : null}

        {error ? (
          <p className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70">
            {error}
          </p>
        ) : null}

        {booking ? (
          <>
            <Legend month={monthLabel(CURRENT_YEAR, CURRENT_MONTH)} />
            {MACHINE_GROUPS.map((group) => (
              <MachineGroupTable
                key={group.id}
                group={group}
                year={CURRENT_YEAR}
                month={CURRENT_MONTH}
                days={days}
                slots={TIME_SLOTS}
                calendar={booking.calendar}
                selectedApartmentId={selectedApartmentId}
                canBook={session !== null}
                onToggle={(day, slotIndex, status) =>
                  handleToggle(group.id, day, slotIndex, status)
                }
              />
            ))}
          </>
        ) : null}
      </main>

      {loginOpen && booking ? (
        <LoginModal
          apartments={booking.users}
          onClose={() => setLoginOpen(false)}
          onLogin={handleLogin}
        />
      ) : null}
    </div>
  )
}

export default App
