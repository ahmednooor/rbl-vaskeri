export type CalendarId = 'calendar-1' | 'calendar-2'

export type MachineGroupId = CalendarId

export type MachineGroup = {
  id: MachineGroupId
  title: string
}

export type TimeSlot = {
  id: string
  label: string
  startMinutes: number
  endMinutes: number
}

/** 8 timeslot rows × 31 day columns. Empty string = ledig. */
export type CalendarGrid = string[][]

export type CalendarData = {
  'calendar-1': CalendarGrid
  'calendar-2': CalendarGrid
}

export type BookingApiData = {
  'calendar-1': CalendarGrid
  'calendar-2': CalendarGrid
  users: string[]
}

export type BookingApiResponse = {
  success: boolean
  data?: BookingApiData
  error?: string
}

export type LoginApiData = {
  isAuthorized: boolean
}

export type LoginApiResponse = {
  success: boolean
  data?: LoginApiData
  error?: string
}

export type BookingState = {
  calendar: CalendarData
  originalCalendar: CalendarData
  users: string[]
}

export type AuthSession = {
  apartment: string
  password: string
}

export type SaveBooking = {
  calendar: CalendarId
  day: number
  slot: string
}

export type SaveStatus = 'cleared' | 'booked'

export type SaveApiResponse = {
  success: boolean
  data?: {
    status: SaveStatus
  }
  error?: string
}

export type DayColumn = {
  day: number
  valid: boolean
  weekday: string
  isWeekend: boolean
  isToday: boolean
}

export type CellStatus = 'empty' | 'mine' | 'taken' | 'invalid'
