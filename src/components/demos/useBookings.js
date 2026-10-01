import { useEffect, useState } from "react";
import { listBookings } from "../../services/bookingStore";

/** Load every stored repair booking for the dashboard, calendar, and charts. */
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listBookings()
      .then((rows) => {
        if (active) setBookings(rows);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  return { bookings, error };
}
