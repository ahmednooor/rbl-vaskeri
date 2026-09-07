import { useEffect, useRef } from 'react'
import type {
  CalendarData,
  CellStatus,
  DayColumn,
  MachineGroup,
  TimeSlot,
} from '../types'
import { getCellApartment, getCellStatus } from '../utils/bookings'

type MachineGroupTableProps = {
  group: MachineGroup
  year: number
  month: number
  days: DayColumn[]
  slots: TimeSlot[]
  calendar: CalendarData
  selectedApartmentId: string
  canBook: boolean
  onToggle: (day: number, slotIndex: number, status: CellStatus) => void
}

export function MachineGroupTable({
  group,
  year,
  month,
  days,
  slots,
  calendar,
  selectedApartmentId,
  canBook,
  onToggle,
}: MachineGroupTableProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLTableCellElement>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    const todayCell = todayRef.current
    if (!scroller || !todayCell) return

    const stickyOffset = 88
    const scrollerRect = scroller.getBoundingClientRect()
    const todayRect = todayCell.getBoundingClientRect()
    const visibleLeft = scrollerRect.left + stickyOffset
    const alreadyInView =
      todayRect.left >= visibleLeft && todayRect.right <= scrollerRect.right

    if (alreadyInView) return

    scroller.scrollTo({
      left: Math.max(0, todayCell.offsetLeft - stickyOffset),
      behavior: 'smooth',
    })
  }, [year, month, group.id])

  return (
    <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_18px_40px_-28px_rgba(40,28,18,0.45)]">
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 bg-sheet px-4 py-3 sm:px-5">
        <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
          {group.title}
        </h2>
        <p className="hidden text-xs text-ink/45 sm:block">
          Scroll sidelengs for alle 31 dager
        </p>
      </div>

      <div ref={scrollerRef} className="overflow-x-auto">
        <table className="min-w-max border-separate border-spacing-0 text-center">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky-time z-20 min-w-20 border-b border-ink/10 bg-sheet px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/50"
              >
                Tid
              </th>
              {days.map((column) => (
                <th
                  key={column.day}
                  ref={column.isToday ? todayRef : undefined}
                  scope="col"
                  className={[
                    'min-w-[2.65rem] border-b border-l border-ink/10 px-1 py-2',
                    column.valid ? '' : 'bg-invalid',
                    column.isWeekend && column.valid ? 'bg-weekend' : '',
                    column.isToday ? 'bg-today' : '',
                  ].join(' ')}
                >
                  {column.valid ? (
                    <span className="flex flex-col items-center leading-tight">
                      <span
                        className={[
                          'text-[11px] font-semibold',
                          column.isWeekend ? 'text-weekend-ink' : 'text-ink/55',
                          column.isToday ? 'text-moss' : '',
                        ].join(' ')}
                      >
                        {column.isToday ? 'I dag' : ''}
                        <br />
                        {column.weekday}
                      </span>
                      <span
                        className={[
                          'mt-0.5 tabular-nums text-sm font-semibold',
                        ].join(' ')}
                      >
                        {column.day}
                      </span>
                    </span>
                  ) : (
                    <span className="text-ink/25">{column.day}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, slotIndex) => {
              const rowBg = slotIndex % 2 === 0 ? 'bg-white' : 'bg-row'
              return (
                <tr key={slot.id} className={rowBg}>
                  <th
                    scope="row"
                    className={`sticky-time z-20 ${rowBg} px-3 py-0 text-left text-[13px] font-semibold tabular-nums text-ink`}
                  >
                    {slot.label}
                  </th>
                  {days.map((column) => {
                    const status = getCellStatus(
                      calendar,
                      group.id,
                      slotIndex,
                      column.day,
                      selectedApartmentId,
                      column.valid,
                    )
                    const apartmentId = getCellApartment(
                      calendar,
                      group.id,
                      slotIndex,
                      column.day,
                    )

                    return (
                      <td
                        key={`${slot.id}-${column.day}`}
                        className="border-l border-ink/[0.06] p-0.5"
                      >
                        <BookingCell
                          status={status}
                          apartmentId={apartmentId}
                          label={`${group.title}, ${column.weekday} ${column.day}, ${slot.label}`}
                          weekend={column.isWeekend && column.valid}
                          canBook={canBook}
                          onClick={() => onToggle(column.day, slotIndex, status)}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

type BookingCellProps = {
  status: CellStatus
  apartmentId?: string
  label: string
  weekend: boolean
  canBook: boolean
  onClick: () => void
}

function BookingCell({
  status,
  apartmentId,
  label,
  weekend,
  canBook,
  onClick,
}: BookingCellProps) {
  const interactive = canBook && (status === 'empty' || status === 'mine')
  const display = status === 'taken' || status === 'mine' ? apartmentId : ''

  const className = [
    'flex h-9 w-full min-w-[2.45rem] items-center justify-center rounded-[5px] text-[11px] font-semibold tabular-nums transition',
    status === 'empty' && weekend
      ? interactive
        ? 'bg-weekend/70 hover:bg-moss/15'
        : 'bg-weekend/70'
      : '',
    status === 'empty' && !weekend
      ? interactive
        ? 'bg-transparent hover:bg-moss/15'
        : 'bg-transparent'
      : '',
    status === 'mine' ? 'bg-moss text-white shadow-sm' : '',
    status === 'taken' ? 'bg-reserved text-ink' : '',
    status === 'invalid' ? 'cursor-default bg-invalid text-transparent' : '',
    interactive
      ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-moss'
      : 'cursor-default',
  ]
    .filter(Boolean)
    .join(' ')

  if (!interactive) {
    return (
      <div className={className} aria-label={`${label}: ${display || 'ikke tilgjengelig'}`}>
        {display}
      </div>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label={
        status === 'mine'
          ? `Avbestill ${label} for ${apartmentId}`
          : `Reserver ${label}`
      }
    >
      {display}
    </button>
  )
}
