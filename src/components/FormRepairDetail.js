import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  monthsSince,
  parseISODate,
  todayISO,
  tomorrowISO,
  yesterdayISO
} from "../utils/helpers";

function FormRepairDetail({ passDataToParent, sendRepairDetails }, ref) {
  const [form, setForm] = useState({
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
  const [errors, setErrors] = useState({});

  const purchaseDate = parseISODate(form.purchaseDate);
  const warrantyDisabled = Boolean(purchaseDate && monthsSince(purchaseDate) > 24);
  const warrantyMsg = warrantyDisabled
    ? "Warranty disabled: purchase date is over 24 months ago."
    : "";

  function updateField(name, value) {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "purchaseDate") {
        const date = parseISODate(value);
        if (date && monthsSince(date) > 24) {
          next.warranty = false;
          passDataToParent(false);
        }
      }
      if (name === "warranty") {
        passDataToParent(Boolean(value) && !warrantyDisabled);
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }

  function validate() {
    const next = {};
    const today = parseISODate(todayISO());
    const purchase = parseISODate(form.purchaseDate);
    const repair = parseISODate(form.repairDate);

    if (!form.purchaseDate) {
      next.purchaseDate = "Purchase date is required.";
    } else if (!purchase) {
      next.purchaseDate = "Purchase date is not a valid date.";
    } else if (purchase >= today) {
      next.purchaseDate = "Purchase date must be before today.";
    }

    if (!form.repairDate) {
      next.repairDate = "Repair date is required.";
    } else if (!repair) {
      next.repairDate = "Repair date is not a valid date.";
    } else if (repair <= today) {
      next.repairDate = "Repair date must be after today.";
    } else if (purchase && repair <= purchase) {
      next.repairDate = "Repair date must be later than the purchase date.";
    }

    if (!form.repairTime) {
      next.repairTime = "Repair time is required.";
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.repairTime)) {
      next.repairTime = "Repair time is not a valid time.";
    }

    if (!form.imei.trim()) {
      next.imei = "IMEI number is required.";
    } else if (!/^\d{15}$/.test(form.imei.trim())) {
      next.imei = "IMEI must be exactly 15 numbers.";
    }

    if (!form.make) next.make = "Make is required.";
    if (!form.faultCategory) next.faultCategory = "Fault category is required.";
    if (!form.description.trim()) next.description = "Description is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function reset() {
    setForm({
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
    setErrors({});
    passDataToParent(false);
  }

  useEffect(() => {
    sendRepairDetails({
      ...form,
      warranty: Boolean(form.warranty) && !warrantyDisabled
    });
  }, [form, warrantyDisabled, sendRepairDetails]);

  useImperativeHandle(ref, () => ({
    validate,
    reset,
    getData: () => ({
      ...form,
      warranty: Boolean(form.warranty) && !warrantyDisabled
    })
  }));

  function errClass(name) {
    return errors[name] ? "invalid" : "";
  }

  return (
    <section className="panel repair-panel" aria-labelledby="repair-heading">
      <h2 id="repair-heading">Repair Details</h2>

      <div className="field">
        <label htmlFor="purchaseDate">Purchase Date <span className="required">*</span></label>
        <input
          type="date"
          id="purchaseDate"
          className={errClass("purchaseDate")}
          max={yesterdayISO()}
          value={form.purchaseDate}
          onChange={(e) => updateField("purchaseDate", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.purchaseDate || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="repairDate">Repair Date <span className="required">*</span></label>
        <input
          type="date"
          id="repairDate"
          className={errClass("repairDate")}
          min={tomorrowISO()}
          value={form.repairDate}
          onChange={(e) => updateField("repairDate", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.repairDate || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="repairTime">Repair Time <span className="required">*</span></label>
        <input
          type="time"
          id="repairTime"
          className={errClass("repairTime")}
          value={form.repairTime}
          onChange={(e) => updateField("repairTime", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.repairTime || ""}</span>
      </div>

      <fieldset className="boxed-group warranty-box">
        <legend>Under Warranty</legend>
        <label>
          <input
            type="checkbox"
            id="warranty"
            checked={form.warranty && !warrantyDisabled}
            disabled={warrantyDisabled}
            onChange={(e) => updateField("warranty", e.target.checked)}
          />
          Warranty
        </label>
      </fieldset>
      <span className={`error-msg${warrantyMsg ? " info-msg" : ""}`} role="alert">
        {warrantyMsg}
      </span>

      <div className="field">
        <label htmlFor="imei">IMEI Number <span className="required">*</span></label>
        <input
          id="imei"
          className={errClass("imei")}
          maxLength={15}
          inputMode="numeric"
          value={form.imei}
          onChange={(e) => updateField("imei", e.target.value.replace(/\D/g, "").slice(0, 15))}
        />
        <span className="error-msg" role="alert">{errors.imei || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="make">Make <span className="required">*</span></label>
        <select
          id="make"
          className={errClass("make")}
          value={form.make}
          onChange={(e) => updateField("make", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Apple">Apple</option>
          <option value="LG">LG</option>
          <option value="Motorola">Motorola</option>
          <option value="Nokia">Nokia</option>
          <option value="Samsung">Samsung</option>
          <option value="Sony">Sony</option>
          <option value="Other">Other</option>
        </select>
        <span className="error-msg" role="alert">{errors.make || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="modelNumber">Model Number</label>
        <input
          id="modelNumber"
          value={form.modelNumber}
          onChange={(e) => updateField("modelNumber", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="faultCategory">Fault Category <span className="required">*</span></label>
        <select
          id="faultCategory"
          className={errClass("faultCategory")}
          value={form.faultCategory}
          onChange={(e) => updateField("faultCategory", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Battery">Battery</option>
          <option value="Charging">Charging</option>
          <option value="Screen">Screen</option>
          <option value="SD-storage">SD-storage</option>
          <option value="Software">Software</option>
          <option value="Other">Other</option>
        </select>
        <span className="error-msg" role="alert">{errors.faultCategory || ""}</span>
      </div>

      <div className="field field-stack">
        <label htmlFor="description">Description <span className="required">*</span></label>
        <textarea
          id="description"
          rows={5}
          className={errClass("description")}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.description || ""}</span>
      </div>
    </section>
  );
}

export default forwardRef(FormRepairDetail);
