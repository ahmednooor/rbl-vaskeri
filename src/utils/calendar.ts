import type { DayColumn } from '../types'

const WEEKDAYS_NO = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'] as const

const MONTHS_NO = [
  'januar',
  'februar',
  'mars',
  'april',
  'mai',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'desember',
] as const

function toDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day)
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function monthLabel(year: number, month: number): string {
  const name = MONTHS_NO[month - 1] ?? ''
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`
}

export function getDayColumns(year: number, month: number): DayColumn[] {
  const today = new Date()
  const validCount = daysInMonth(year, month)

  return Array.from({ length: 31 }, (_, index) => {
    const day = index + 1
    const valid = day <= validCount
    if (!valid) {
      return {
        day,
        valid: false,
        weekday: '',
        isWeekend: false,
        isToday: false,
      }
    }

    const date = toDate(year, month, day)
    const weekdayIndex = date.getDay()

    return {
      day,
      valid: true,
      weekday: WEEKDAYS_NO[weekdayIndex] ?? '',
      isWeekend: weekdayIndex === 0 || weekdayIndex === 6,
      isToday:
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate(),
    }
  })
}
