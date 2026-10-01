import { useMemo } from "react";
import { useBookings } from "./useBookings";

const COLOURS = ["#1d6fd6", "#e07060", "#2f8f8f", "#c5a017", "#6a4c93", "#2f3e4e", "#8fd4a8"];

function tally(bookings, readLabel) {
  const counts = {};
  bookings.forEach((booking) => {
    const label = readLabel(booking) || "Unknown";
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.keys(counts).map((label, index) => ({
    label,
    count: counts[label],
    colour: COLOURS[index % COLOURS.length]
  }));
}

function conic(parts) {
  const total = parts.reduce((sum, part) => sum + part.count, 0) || 1;
  let angle = 0;
  const stops = parts.map((part) => {
    const next = angle + (part.count / total) * 360;
    const stop = part.colour + " " + angle + "deg " + next + "deg";
    angle = next;
    return stop;
  });
  return "conic-gradient(" + stops.join(", ") + ")";
}

function Bars({ title, parts }) {
  const max = Math.max(1, ...parts.map((part) => part.count));
  return (
    <div>
      <h4>{title}</h4>
      {parts.map((part) => (
        <div key={part.label} className="chart-row">
          <span>{part.label}</span>
          <div className="chart-track">
            <div style={{ width: (part.count / max) * 100 + "%", background: part.colour }} />
          </div>
          <strong>{part.count}</strong>
        </div>
      ))}
    </div>
  );
}

function Demo4() {
  const { bookings, error } = useBookings();
  const faults = useMemo(() => tally(bookings, (booking) => booking.repair.faultCategory), [bookings]);
  const types = useMemo(
    () => tally(bookings, (booking) => (booking.customer.customerType === "business" ? "Business" : "Consumer")),
    [bookings]
  );
  const makes = useMemo(() => tally(bookings, (booking) => booking.repair.make), [bookings]);

  return (
    <section>
      <h3>Demo 4: Booking charts</h3>
      <p>
        Counts the stored jobs by fault category, phone make, and customer type.
        The ring is the customer-type split.
      </p>
      {error && <p className="form-status error">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings yet. Submit the home form, then open this demo again.</p>
      ) : (
        <>
          <div className="chart-pie-row">
            <div className="chart-pie" style={{ background: conic(types) }} role="img" aria-label="Customer type chart" />
            <ul className="chart-legend">
              {types.map((part) => (
                <li key={part.label}>
                  <i style={{ background: part.colour }} />
                  {part.label}: {part.count}
                </li>
              ))}
            </ul>
          </div>
          <Bars title="Fault categories" parts={faults} />
          <Bars title="Phone makes" parts={makes} />
        </>
      )}
    </section>
  );
}

export default Demo4;
