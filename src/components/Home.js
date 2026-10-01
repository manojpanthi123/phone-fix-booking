import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCustomerDetail from "./FormCustomerDetail";
import FormRepairDetail from "./FormRepairDetail";
import FormCourtesyPhone from "./FormCourtesyPhone";
import FormCost from "./FormCost";
import FormButtons from "./FormButtons";
import { BUSINESS, GST_RATE, SERVICE_FEE, formatInvoiceDate, formatRepairDateTime, createJobNumber } from "../utils/helpers";
import { saveBooking } from "../services/bookingStore";

function Home() {
  const customerRef = useRef(null);
  const repairRef = useRef(null);
  const courtesyRef = useRef(null);

  const [sharedBond, setSharedBond] = useState(0);
  const [sharedWarranty, setSharedWarranty] = useState(false);
  const [sharedCustomerType, setSharedCustomerType] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    title: "Mr",
    firstname: "",
    lastname: ""
  });
  const [repairDetails, setRepairDetails] = useState({
    purchaseDate: "",
    repairDate: "",
    repairTime: "",
    warranty: false,
    imei: "",
    make: "",
    modelNumber: "",
    faultCategory: "",
    description: ""
  });
  const [courtesyDetails, setCourtesyDetails] = useState({ phone: null, charger: null });
  const [status, setStatus] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const sendCustomerDetails = useCallback((value) => setCustomerDetails(value), []);
  const sendRepairDetails = useCallback((value) => setRepairDetails(value), []);
  const sendCourtesyDetails = useCallback((value) => setCourtesyDetails(value), []);

  async function onSubmit(event) {
    event.preventDefault();
    const customerOk = customerRef.current.validate();
    const repairOk = repairRef.current.validate();

    if (!customerOk || !repairOk) {
      setStatus({
        message: "Please correct the errors before submitting.",
        type: "error"
      });
      return;
    }

    const bond = sharedCustomerType ? sharedBond : 0;
    const serviceFee = sharedWarranty ? 0 : SERVICE_FEE;
    const total = bond + serviceFee;
    const gst = total * GST_RATE;
    const now = new Date();
    const courtesyItems = [courtesyDetails.phone, courtesyDetails.charger]
      .filter(Boolean)
      .map((item) => ({ name: item.name, bond: item.bond, type: item.type }));

    const costs = {
      bond,
      serviceFee,
      total,
      gst,
      totalGst: total + gst
    };

    // Data attached to the /invoice route. Invoice reads it with useLocation.
    const attachedData = {
      sharedBond: bond,
      sharedWarranty,
      sharedCustomerType,
      customerDetails,
      repairDetails,
      courtesyItems,
      costs,
      jobNumber: createJobNumber(),
      invoiceAt: now.toISOString(),
      invoiceDisplay: formatInvoiceDate(now),
      repairDisplay: formatRepairDateTime(repairDetails.repairDate, repairDetails.repairTime),
      business: BUSINESS
    };

    const booking = {
      jobNumber: attachedData.jobNumber,
      invoiceAt: attachedData.invoiceAt,
      invoiceDisplay: attachedData.invoiceDisplay,
      repairDisplay: attachedData.repairDisplay,
      customer: {
        customerType: sharedCustomerType ? "consumer" : "business",
        title: customerDetails.title,
        firstName: customerDetails.firstname,
        lastName: customerDetails.lastname,
        street: customerDetails.street,
        suburb: customerDetails.suburb,
        city: customerDetails.city,
        postCode: customerDetails.postCode,
        phone: customerDetails.phone,
        email: customerDetails.email
      },
      repair: repairDetails,
      courtesyItems,
      costs,
      business: BUSINESS,
      storedIn: "browser"
    };

    try {
      const saved = await saveBooking(booking);
      const where = saved.storedIn === "supabase" ? "Supabase" : "this browser";
      setStatus({
        message: "Booking " + saved.jobNumber + " stored in " + where + ".",
        type: "success"
      });
      navigate("/invoice", { state: { attachedData } });
    } catch (error) {
      setStatus({
        message: "The booking could not be stored. " + error.message,
        type: "error"
      });
    }
  }

  function onReset(event) {
    event.preventDefault();
    customerRef.current.reset();
    repairRef.current.reset();
    courtesyRef.current.reset();
    setSharedBond(0);
    setSharedWarranty(false);
    setSharedCustomerType(true);
    setStatus({ message: "Form has been reset to default values.", type: "" });
  }

  return (
    <main>
      <form id="bookingForm" onSubmit={onSubmit} onReset={onReset} noValidate>
        <div className="form-grid">
          <FormCustomerDetail
            ref={customerRef}
            passDataToParent={setSharedCustomerType}
            sendCustomerDetails={sendCustomerDetails}
          />
          <FormRepairDetail
            ref={repairRef}
            passDataToParent={setSharedWarranty}
            sendRepairDetails={sendRepairDetails}
          />
          <div className="right-column">
            <FormCourtesyPhone
              ref={courtesyRef}
              passDataToParent={setSharedBond}
              sendCourtesyDetails={sendCourtesyDetails}
            />
            <FormCost
              sharedBond={sharedBond}
              sharedWarranty={sharedWarranty}
              sharedCustomerType={sharedCustomerType}
            />
          </div>
        </div>
        <FormButtons status={status} />
      </form>
    </main>
  );
}

export default Home;
