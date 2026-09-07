const BOOKING_API_URL =
  'https://script.google.com/macros/s/AKfycbz1ceSZ3uDhuE0eTgAipbzLMw_9_KGudUajcJjSAZ2Jrij-EHg11fShrb1BZ5gv6YFk/exec'

export type BookingAction = 'getAllData' | 'login' | 'save'

export async function postBookingAction(
  action: BookingAction,
  payload: Record<string, unknown> = {},
): Promise<unknown> {
  const response = await fetch(BOOKING_API_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({ action, ...payload }),
  })

  if (!response.ok) {
    throw new Error(`Kunne ikke kontakte serveren (${response.status})`)
  }

  return response.json() as Promise<unknown>
}
