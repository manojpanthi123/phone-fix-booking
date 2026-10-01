import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatMoney } from "../utils/helpers";
import { bookingToAttached, listBookings } from "../services/bookingStore";

function Invoice() {
  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state && location.state.attachedData;
  const [stored, setStored] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listBookings()
      .then((rows) => {
        if (active) setStored(rows);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, [receivedData && receivedData.jobNumber]);

  function openStored(booking) {
    navigate("/invoice", { state: { attachedData: bookingToAttached(booking) } });
  }

  return (
    <main className="sheet-main">
      <p><Link to="/">Back to the booking form</Link></p>
      {error && <p className="form-status error">{error}</p>}

      {stored.length > 0 && (
        <section className="panel sheet-panel">
          <h2>Stored repair bookings</h2>
          <ul className="job-list">
            {stored.map((item) => (
              <li key={item.jobNumber}>
                <button
                  type="button"
                  className={receivedData && item.jobNumber === receivedData.jobNumber ? "job-pick active" : "job-pick"}
                  onClick={() => openStored(item)}
                >
                  {item.jobNumber} — {item.customer.firstName} {item.customer.lastName} — {item.invoiceDisplay}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!receivedData ? (
        <h2>ERROR! No data is passed on.</h2>
      ) : (
        <JobSheet receivedData={receivedData} />
      )}
    </main>
  );
}

function JobSheet({ receivedData }) {
  const customer = receivedData.customerDetails;
  const repair = receivedData.repairDetails;
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
          <strong>{formatMoney(receivedData.costs.totalGst)}</strong>
        </p>
      </header>

      <div className="job-cols">
        <section>
          <h3>Customer details</h3>
          <p>Customer type: {receivedData.sharedCustomerType ? "Customer" : "Business"}</p>
          <p>Title: {customer.title}</p>
          <p>First name: {customer.firstname}</p>
          <p>Last name: {customer.lastname}</p>
          <p>Address: {address}</p>
          <p>Phone: {customer.phone}</p>
          <p>Email: {customer.email}</p>
        </section>
        <section>
          <h3>Repair job</h3>
          <p>Job number: {receivedData.jobNumber}</p>
          <p>Invoice date: {receivedData.invoiceDisplay}</p>
        </section>
      </div>

      <section>
        <h3>Repair details</h3>
        <p>Purchase date: {repair.purchaseDate}</p>
        <p>Repair date/time: {receivedData.repairDisplay}</p>
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
            {receivedData.courtesyItems.length === 0 ? (
              <tr>
                <td colSpan={2}>No courtesy phone or charger</td>
              </tr>
            ) : (
              receivedData.courtesyItems.map((item) => (
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
        <p>Bond: {formatMoney(receivedData.sharedBond)}</p>
        <p>Service fee: {formatMoney(receivedData.costs.serviceFee)}</p>
        <p>Total: {formatMoney(receivedData.costs.total)}</p>
        <p>GST: {formatMoney(receivedData.costs.gst)}</p>
        <p>Total (+GST): {formatMoney(receivedData.costs.totalGst)}</p>
      </section>

      <footer className="job-biz">
        <div>
          <p><strong>{receivedData.business.name}</strong></p>
          <p>
            {receivedData.business.addressLine1}
            <br />
            {receivedData.business.addressLine2}
          </p>
        </div>
        <div>
          <p><strong>Contact us</strong></p>
          <p>Phone: {receivedData.business.phone}</p>
          <p>Email: {receivedData.business.email}</p>
        </div>
      </footer>
    </article>
  );
}

export default Invoice;
