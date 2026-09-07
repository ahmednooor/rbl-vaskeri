import type { CalendarData, CalendarGrid } from '../types'

export function cloneGrid(grid: CalendarGrid): CalendarGrid {
  return grid.map((row) => [...row])
}

export function cloneCalendar(data: CalendarData): CalendarData {
  return {
    'calendar-1': cloneGrid(data['calendar-1']),
    'calendar-2': cloneGrid(data['calendar-2']),
  }
}
