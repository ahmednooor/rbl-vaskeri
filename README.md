# rbl-vaskeri

Booking UI for the laundry rooms at Borettslag. Residents log in with apartment number and password, pick one time slot, and save it.

Built with Vite, React, TypeScript, and Tailwind CSS. Bookings are stored in a Google Sheet via an Apps Script web app.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build   # production build
npm run preview # serve the build
```

## How it works

- Two calendars for the current month: washers 1 & 2 + dryer 6, and washer 3 + dryer 7.
- Eight time slots per day (`08 - 11` through `20 - 22`). Empty cells are bookable even if times overlap. This is by design.
- One reservation per apartment across both calendars. Click your slot to cancel it, then save.
- Credentials stay in memory only. After a successful or failed save, the pending booking is cleared so the next save starts from a clean request.

## Backend

The client POSTs JSON as `text/plain` (to skip CORS preflight) to the Apps Script endpoint in `src/services/booking/bookingClient.ts`.

| Action | Body | Result |
| --- | --- | --- |
| `getAllData` | `{ action }` | Calendars (`calendar-1`, `calendar-2`) and apartment list (`users`) |
| `login` | `{ action, apartment, password }` | Auth check |
| `save` | `{ action, apartment, password, booking }` | `booking` is `{ calendar, day, slot }` or `null` to clear |

`save` returns `booked` or `cleared`. The UI refetches calendars after save (success or failure) and after logout.
