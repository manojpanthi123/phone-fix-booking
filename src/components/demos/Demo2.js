import { useMemo, useState } from "react";
import { formatMoney } from "../../utils/helpers";
import { useBookings } from "./useBookings";

function Demo2() {
  const { bookings, error } = useBookings();
  const [keyword, setKeyword] = useState("");
  const [customerType, setCustomerType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const rows = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    const filtered = bookings.filter((booking) => {
      const type = booking.customer.customerType;
      if (customerType !== "all" && type !== customerType) return false;
      if (!term) return true;
      const haystack = [
        booking.jobNumber,
        booking.customer.firstName,
        booking.customer.lastName,
        booking.repair.faultCategory,
        booking.repair.make
      ].join(" ").toLowerCase();
      return haystack.includes(term);
    });

    return filtered.slice().sort((a, b) => {
      if (sortBy === "name") {
        return (a.customer.lastName + a.customer.firstName).localeCompare(
          b.customer.lastName + b.customer.firstName
        );
      }
      const aTime = new Date(a.invoiceAt).getTime();
      const bTime = new Date(b.invoiceAt).getTime();
      return sortBy === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [bookings, keyword, customerType, sortBy]);

  return (
    <section>
      <h3>Demo 2: Booking dashboard</h3>
      <p>
        Lists every repair booking, then filters by keyword or customer type and
        sorts by invoice date or customer name.
      </p>
      {error && <p className="form-status error">{error}</p>}
      <div className="demo-filters">
        <input
          type="search"
          placeholder="Search job, name, fault, make"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label="Search bookings"
        />
        <select value={customerType} onChange={(event) => setCustomerType(event.target.value)} aria-label="Filter by customer type">
          <option value="all">All customers</option>
          <option value="consumer">Consumer</option>
          <option value="business">Business</option>
        </select>
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort bookings">
          <option value="newest">Newest invoice</option>
          <option value="oldest">Oldest invoice</option>
          <option value="name">Customer name</option>
        </select>
      </div>
      {rows.length === 0 ? (
        <p>No bookings match. Submit the home form to add one.</p>
      ) : (
        <div className="demo-table-wrap">
          <table className="job-table demo-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Repair</th>
                <th>Fault</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => (
                <tr key={booking.jobNumber}>
                  <td>{booking.jobNumber}</td>
                  <td>{booking.customer.firstName} {booking.customer.lastName}</td>
                  <td>{booking.customer.customerType === "business" ? "Business" : "Consumer"}</td>
                  <td>{booking.repair.repairDate}</td>
                  <td>{booking.repair.faultCategory}</td>
                  <td>{formatMoney(booking.costs.totalGst)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Demo2;
