import { useMemo, useState } from "react";
import { useBookings } from "./useBookings";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pad(value) {
  return String(value).padStart(2, "0");
}

function Demo3() {
  const { bookings, error } = useBookings();
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const lead = (first.getDay() + 6) % 7;
    const count = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const days = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= count; day += 1) days.push(day);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [cursor]);

  const byDate = useMemo(() => {
    const grouped = {};
    bookings.forEach((booking) => {
      const key = booking.repair.repairDate;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(booking);
    });
    return grouped;
  }, [bookings]);

  const title = new Date(cursor.year, cursor.month, 1).toLocaleString("en-NZ", {
    month: "long",
    year: "numeric"
  });

  function shift(amount) {
    const next = new Date(cursor.year, cursor.month + amount, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  }

  return (
    <section>
      <h3>Demo 3: Repair calendar</h3>
      <p>Each repair date from the stored bookings is marked on the month. Move between months with the buttons.</p>
      {error && <p className="form-status error">{error}</p>}
      <div className="cal-nav">
        <button type="button" className="demo-chip" onClick={() => shift(-1)}>Previous</button>
        <strong>{title}</strong>
        <button type="button" className="demo-chip" onClick={() => shift(1)}>Next</button>
      </div>
      <div className="cal-grid">
        {WEEKDAYS.map((name) => (
          <div key={name} className="cal-head">{name}</div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={"empty" + index} className="cal-day empty" />;
          const key = cursor.year + "-" + pad(cursor.month + 1) + "-" + pad(day);
          const jobs = byDate[key] || [];
          const weekend = index % 7 >= 5;
          const now = new Date();
          const today = now.getFullYear() === cursor.year && now.getMonth() === cursor.month && now.getDate() === day;
          const className = ["cal-day", jobs.length ? "booked" : "", weekend ? "weekend" : "", today ? "today" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <div key={key} className={className}>
              <span>{day}</span>
              {jobs.slice(0, 2).map((job) => (
                <small key={job.jobNumber}>{job.jobNumber}</small>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Demo3;
