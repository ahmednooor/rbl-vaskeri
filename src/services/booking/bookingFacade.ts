import type { AuthSession, BookingState, SaveBooking, SaveStatus } from '../../types'
import { postBookingAction } from './bookingClient'
import {
  parseBookingResponse,
  parseLoginResponse,
  parseSaveResponse,
  toSavePayload,
} from './bookingMapper'

/** Single entry point for all booking backend operations. */
export const bookingFacade = {
  async getAllData(): Promise<BookingState> {
    const payload = await postBookingAction('getAllData')
    return parseBookingResponse(payload)
  },

  async login(apartment: string, password: string): Promise<void> {
    const payload = await postBookingAction('login', { apartment, password })
    parseLoginResponse(payload)
  },

  async save(
    session: AuthSession,
    booking: SaveBooking | null,
  ): Promise<SaveStatus> {
    const payload = await postBookingAction(
      'save',
      toSavePayload(session.apartment, session.password, booking),
    )
    return parseSaveResponse(payload)
  },
}
