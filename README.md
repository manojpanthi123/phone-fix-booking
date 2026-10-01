# Phone Fix Booking – Weeks 10 to 14

React SPA following the class lecture: NavBar, Header, Footer, and homepage form components.

## Run

```bash
cd react-demo
npm start
```

Leave that command running, then open [http://localhost:3000](http://localhost:3000).

Use `http`, not `https`. Safari cannot connect if `npm start` is not running.

## Published site

The hosted site is [https://manojpanthi123.github.io/phone-fix-booking/](https://manojpanthi123.github.io/phone-fix-booking/).

The source is [https://github.com/manojpanthi123/phone-fix-booking](https://github.com/manojpanthi123/phone-fix-booking).

## Bookings

Submit on the homepage stores the repair job in the Supabase table `bookings`. Open [https://supabase.com/dashboard](https://supabase.com/dashboard), choose the project, then open **Table Editor** and the `bookings` table.

`REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in `.env` are the values the app uses to reach that table. The project URL is the database API address.

## W10 included

- Navigation: Home / Extension
- Extension page describes five features and each one runs: shop map, booking dashboard, repair calendar, charts, and drag-and-drop courtesy loan
- `review.doc` in the project folder discusses the issues, how bookings are stored, and what could be improved
- Homepage UI (Customer, Repair, Courtesy, Cost)
- Input validation (names, post code, phone, email, dates, warranty, IMEI, selects)
- Courtesy phone: one phone and/or one charger
- Cost: disabled fields, $ format, bond, service fee, GST 15%
- FAQ button opens a new window. Questions come from JSON and the search box filters them.
- Submit validates the form, stores the repair booking, then opens `/invoice`.
- Home passes `attachedData` with `useNavigate`. Invoice reads it with `useLocation`.
- The job sheet shows every field, a unique job number, the invoice time in 24-hour form, and the repair time in 12-hour form.
- If `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` are set, bookings are stored in the Supabase `bookings` table (`supabase/bookings.sql`). Otherwise they are stored in this browser.
