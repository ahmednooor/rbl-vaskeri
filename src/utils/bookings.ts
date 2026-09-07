import { TIME_SLOTS } from '../data/schedule'
import type { CalendarData, CellStatus, MachineGroupId, SaveBooking } from '../types'
import { cloneCalendar } from './calendarData'

const CALENDAR_IDS = ['calendar-1', 'calendar-2'] as const

export function getCellApartment(
  calendar: CalendarData,
  groupId: MachineGroupId,
  slotIndex: number,
  day: number,
): string {
  return calendar[groupId][slotIndex]?.[day - 1] ?? ''
}

export function getCellStatus(
  calendar: CalendarData,
  groupId: MachineGroupId,
  slotIndex: number,
  day: number,
  selectedApartmentId: string | null,
  dayValid: boolean,
): CellStatus {
  if (!dayValid) return 'invalid'

  const apartmentId = getCellApartment(calendar, groupId, slotIndex, day)
  if (!apartmentId) return 'empty'
  if (selectedApartmentId && apartmentId === selectedApartmentId) return 'mine'
  return 'taken'
}

function clearApartment(calendar: CalendarData, apartmentId: string) {
  for (const groupId of CALENDAR_IDS) {
    for (const row of calendar[groupId]) {
      for (let column = 0; column < row.length; column += 1) {
        if (row[column] === apartmentId) row[column] = ''
      }
    }
  }
}

export function findUserBooking(
  calendar: CalendarData,
  apartmentId: string,
): SaveBooking | null {
  if (!apartmentId) return null

  for (const calendarId of CALENDAR_IDS) {
    const grid = calendar[calendarId]
    for (let slotIndex = 0; slotIndex < grid.length; slotIndex += 1) {
      const row = grid[slotIndex]
      const column = row.findIndex((cell) => cell === apartmentId)
      if (column === -1) continue
      const slot = TIME_SLOTS[slotIndex]
      if (!slot) continue
      return {
        calendar: calendarId,
        day: column + 1,
        slot: slot.label,
      }
    }
  }

  return null
}

export function toggleBooking(
  calendar: CalendarData,
  groupId: MachineGroupId,
  slotIndex: number,
  day: number,
  apartmentId: string,
  status: CellStatus,
): CalendarData {
  const next = cloneCalendar(calendar)
  const column = day - 1

  if (status === 'mine') {
    next[groupId][slotIndex][column] = ''
    return next
  }

  if (status !== 'empty') return calendar

  clearApartment(next, apartmentId)
  next[groupId][slotIndex][column] = apartmentId
  return next
}
