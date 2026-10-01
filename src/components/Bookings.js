import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatMoney } from "../utils/helpers";
import { listBookings } from "../services/bookingStore";

function JobSheet({ booking }) {
  const customer = booking.customer;
  const repair = booking.repair;
  const address = [customer.street, customer.suburb, customer.city, customer.postCode]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="job-sheet">
      <header className="job-head">
        <h2>Repair Booking</h2>
        <p>
          Amount due
          <br />
          <strong>{formatMoney(booking.costs.totalGst)}</strong>
        </p>
      </header>

      <div className="job-cols">
        <section>
          <h3>Customer details</h3>
          <p>Customer type: {customer.customerType === "business" ? "Business" : "Consumer"}</p>
          <p>Title: {customer.title}</p>
          <p>First name: {customer.firstName}</p>
          <p>Last name: {customer.lastName}</p>
          <p>Address: {address}</p>
          <p>Phone: {customer.phone}</p>
          <p>Email: {customer.email}</p>
        </section>
        <section>
          <h3>Repair job</h3>
          <p>Job number: {booking.jobNumber}</p>
          <p>Invoice date: {booking.invoiceDisplay}</p>
        </section>
      </div>

      <section>
        <h3>Repair details</h3>
        <p>Purchase date: {repair.purchaseDate}</p>
        <p>Repair date/time: {booking.repairDisplay}</p>
        <p>Warranty: {repair.warranty ? "Yes" : "No"}</p>
        <p>IMEI: {repair.imei}</p>
        <p>Make: {repair.make}</p>
        <p>Model number: {repair.modelNumber || "—"}</p>
        <p>Fault category: {repair.faultCategory}</p>
        <p>Description: {repair.description}</p>
      </section>

      <section>
        <h3>Courtesy loan device</h3>
        <table className="job-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {booking.courtesyItems.length === 0 ? (
              <tr>
                <td colSpan={2}>No courtesy phone or charger</td>
              </tr>
            ) : (
              booking.courtesyItems.map((item) => (
                <tr key={item.type + item.name}>
                  <td>{item.name}</td>
                  <td>{formatMoney(item.bond)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="job-totals">
        <h3>Totals</h3>
        <p>Bond: {formatMoney(booking.costs.bond)}</p>
        <p>Service fee: {formatMoney(booking.costs.serviceFee)}</p>
        <p>Total: {formatMoney(booking.costs.total)}</p>
        <p>GST: {formatMoney(booking.costs.gst)}</p>
        <p>Total (+GST): {formatMoney(booking.costs.totalGst)}</p>
      </section>

      <footer className="job-biz">
        <div>
          <p><strong>{booking.business.name}</strong></p>
          <p>
            {booking.business.addressLine1}
            <br />
            {booking.business.addressLine2}
          </p>
        </div>
        <div>
          <p><strong>Contact us</strong></p>
          <p>Phone: {booking.business.phone}</p>
          <p>Email: {booking.business.email}</p>
        </div>
      </footer>
    </article>
  );
}

function Bookings() {
  const location = useLocation();
  const requested = location.state && location.state.jobNumber;
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(requested || "");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listBookings()
      .then((rows) => {
        if (!active) return;
        setBookings(rows);
        if (requested) {
          setSelected(requested);
        } else if (rows[0]) {
          setSelected(rows[0].jobNumber);
        }
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, [requested]);

  const current = bookings.find((item) => item.jobNumber === selected) || bookings[0];

  return (
    <main className="sheet-main">
      <p><Link to="/">Back to the booking form</Link></p>
      {error && <p className="form-status error">{error}</p>}
      {bookings.length === 0 ? (
        <p className="sheet-empty">No repair bookings yet. Submit the home form first.</p>
      ) : (
        <>
          <section className="panel sheet-panel">
            <h2>Stored repair bookings</h2>
            <p>
              {current && current.storedIn === "supabase"
                ? "These jobs were loaded from the Supabase bookings table."
                : "These jobs are stored in this browser. Add your Supabase URL and anon key to save them in the bookings table."}
            </p>
            <ul className="job-list">
              {bookings.map((item) => (
                <li key={item.jobNumber}>
                  <button
                    type="button"
                    className={item.jobNumber === (current && current.jobNumber) ? "job-pick active" : "job-pick"}
                    onClick={() => setSelected(item.jobNumber)}
                  >
                    {item.jobNumber} — {item.customer.firstName} {item.customer.lastName} — {item.invoiceDisplay}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {current && <JobSheet booking={current} />}
        </>
      )}
    </main>
  );
}

export default Bookings;
