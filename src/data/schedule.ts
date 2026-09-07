import type { MachineGroup, TimeSlot } from '../types'

function slot(startHour: number, endHour: number): TimeSlot {
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    id: `${pad(startHour)}-${pad(endHour)}`,
    label: `${pad(startHour)} - ${pad(endHour)}`,
    startMinutes: startHour * 60,
    endMinutes: endHour * 60,
  }
}

export const TIME_SLOTS: TimeSlot[] = [
  slot(8, 11),
  slot(10, 13),
  slot(12, 15),
  slot(14, 17),
  slot(16, 19),
  slot(18, 21),
  slot(20, 22),
  slot(16, 18),
]

export const MACHINE_GROUPS: MachineGroup[] = [
  {
    id: 'calendar-1',
    title: 'Vaskemaskin 1 & 2 – Tørketrommel 6',
  },
  {
    id: 'calendar-2',
    title: 'Vaskemaskin 3 – Tørketrommel 7',
  },
]
