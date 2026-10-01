import { formatMoney, GST_RATE, SERVICE_FEE } from "../utils/helpers";

function FormCost({ sharedBond, sharedWarranty, sharedCustomerType }) {
  const bond = sharedCustomerType ? sharedBond : 0;
  const serviceFee = sharedWarranty ? 0 : SERVICE_FEE;
  const total = bond + serviceFee;
  const gst = total * GST_RATE;

  return (
    <section className="panel cost-panel" aria-labelledby="cost-heading">
      <h2 id="cost-heading">Cost</h2>

      <div className="field cost-field">
        <label htmlFor="bond">Bond:</label>
        <input id="bond" type="text" value={formatMoney(bond)} disabled readOnly />
      </div>
      <div className="field cost-field">
        <label htmlFor="serviceFee">Service Fee:</label>
        <input id="serviceFee" type="text" value={formatMoney(serviceFee)} disabled readOnly />
      </div>
      <div className="field cost-field">
        <label htmlFor="total">Total:</label>
        <input id="total" type="text" value={formatMoney(total)} disabled readOnly />
      </div>
      <div className="field cost-field">
        <label htmlFor="gst">GST:</label>
        <input id="gst" type="text" value={formatMoney(gst)} disabled readOnly />
      </div>
      <div className="field cost-field">
        <label htmlFor="totalGst">Total(+GST):</label>
        <input id="totalGst" type="text" value={formatMoney(total + gst)} disabled readOnly />
      </div>
    </section>
  );
}

export default FormCost;
