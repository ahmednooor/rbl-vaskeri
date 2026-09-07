import type {
  BookingApiResponse,
  BookingState,
  CalendarGrid,
  LoginApiResponse,
  SaveApiResponse,
  SaveBooking,
  SaveStatus,
} from '../../types'
import { cloneGrid } from '../../utils/calendarData'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCalendarGrid(value: unknown): value is CalendarGrid {
  return (
    Array.isArray(value) &&
    value.every(
      (row) =>
        Array.isArray(row) && row.every((cell) => typeof cell === 'string'),
    )
  )
}

function readErrorMessage(value: unknown, fallback: string): string {
  if (isRecord(value) && typeof value.error === 'string' && value.error) {
    return value.error
  }
  return fallback
}

export function parseBookingResponse(value: unknown): BookingState {
  if (!isRecord(value)) {
    throw new Error('Ugyldig svar fra serveren')
  }

  const response = value as BookingApiResponse
  const data = response.data

  if (
    response.success !== true ||
    typeof data !== 'object' ||
    data === null ||
    !isCalendarGrid(data['calendar-1']) ||
    !isCalendarGrid(data['calendar-2']) ||
    !Array.isArray(data.users) ||
    !data.users.every((user) => typeof user === 'string')
  ) {
    throw new Error(readErrorMessage(value, 'Ugyldig svar fra serveren'))
  }

  return {
    calendar: {
      'calendar-1': cloneGrid(data['calendar-1']),
      'calendar-2': cloneGrid(data['calendar-2']),
    },
    originalCalendar: {
      'calendar-1': cloneGrid(data['calendar-1']),
      'calendar-2': cloneGrid(data['calendar-2']),
    },
    users: [...data.users],
  }
}

export function parseLoginResponse(value: unknown): void {
  if (!isRecord(value)) {
    throw new Error('Ugyldig svar fra serveren')
  }

  const response = value as LoginApiResponse
  if (response.success === true && response.data?.isAuthorized === true) {
    return
  }

  throw new Error(readErrorMessage(value, 'Innlogging feilet'))
}

export function parseSaveResponse(value: unknown): SaveStatus {
  if (!isRecord(value)) {
    throw new Error('Ugyldig svar fra serveren')
  }

  const response = value as SaveApiResponse
  const status = response.data?.status
  if (
    response.success === true &&
    (status === 'cleared' || status === 'booked')
  ) {
    return status
  }

  throw new Error(readErrorMessage(value, 'Lagring feilet'))
}

export function toSavePayload(
  apartment: string,
  password: string,
  booking: SaveBooking | null,
): Record<string, unknown> {
  return {
    apartment,
    password,
    booking,
  }
}
