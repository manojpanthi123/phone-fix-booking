import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const NAME_PATTERN = /^[A-Za-z\s\-\u2013]+$/;

function FormCustomerDetail({ passDataToParent, sendCustomerDetails }, ref) {
  const [form, setForm] = useState({
    customerType: "consumer",
    title: "Mr",
    firstName: "",
    lastName: "",
    street: "",
    suburb: "",
    city: "",
    postCode: "",
    phone: "",
    email: ""
  });
  const [errors, setErrors] = useState({});

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const next = {};
    if (!form.customerType) next.customerType = "Customer type is required.";
    if (!form.title) next.title = "Title is required.";

    if (!form.firstName.trim()) {
      next.firstName = "First name is required.";
    } else if (!NAME_PATTERN.test(form.firstName.trim()) || !/[A-Za-z]/.test(form.firstName)) {
      next.firstName = "First name may only contain letters, spaces and hyphens.";
    }

    if (!form.lastName.trim()) {
      next.lastName = "Last name is required.";
    } else if (!NAME_PATTERN.test(form.lastName.trim()) || !/[A-Za-z]/.test(form.lastName)) {
      next.lastName = "Last name may only contain letters, spaces and hyphens.";
    }

    if (!form.street.trim()) next.street = "Street is required.";
    if (!form.city.trim()) next.city = "City is required.";

    if (!form.postCode.trim()) {
      next.postCode = "Post code is required (4 numbers).";
    } else if (!/^\d{4}$/.test(form.postCode.trim())) {
      next.postCode = "Post code must be exactly 4 numbers.";
    }

    const phone = form.phone.trim();
    if (!phone) {
      next.phone = "Phone number is required.";
    } else if (!/^[0-9\s()\-+]+$/.test(phone) || !/\d/.test(phone)) {
      next.phone = "Phone may only contain numbers, spaces, ( ), - and +.";
    }

    const email = form.email.trim();
    if (!email) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function reset() {
    setForm({
      customerType: "consumer",
      title: "Mr",
      firstName: "",
      lastName: "",
      street: "",
      suburb: "",
      city: "",
      postCode: "",
      phone: "",
      email: ""
    });
    setErrors({});
    passDataToParent(true);
  }

  useImperativeHandle(ref, () => ({
    validate,
    reset,
    getData: () => form
  }));

  // Keep Home in sync as the fields change, then Home forwards this to Invoice.
  useEffect(() => {
    sendCustomerDetails({
      title: form.title,
      firstname: form.firstName,
      lastname: form.lastName,
      street: form.street,
      suburb: form.suburb,
      city: form.city,
      postCode: form.postCode,
      phone: form.phone,
      email: form.email
    });
  }, [form, sendCustomerDetails]);

  function errClass(name) {
    return errors[name] ? "invalid" : "";
  }

  return (
    <section className="panel customer-panel" aria-labelledby="customer-heading">
      <h2 id="customer-heading">Customer Details</h2>

      <fieldset className="boxed-group">
        <legend>
          Customer Type <span className="required">*</span>
        </legend>
        <label>
          <input
            type="radio"
            name="customerType"
            value="consumer"
            checked={form.customerType === "consumer"}
            onChange={() => {
              updateField("customerType", "consumer");
              passDataToParent(true);
            }}
          />
          Consumer
        </label>
        <label>
          <input
            type="radio"
            name="customerType"
            value="business"
            checked={form.customerType === "business"}
            onChange={() => {
              updateField("customerType", "business");
              passDataToParent(false);
            }}
          />
          Business
        </label>
      </fieldset>
      <span className="error-msg" role="alert">{errors.customerType || ""}</span>

      <div className="field">
        <label htmlFor="title">Title <span className="required">*</span></label>
        <select
          id="title"
          className={errClass("title")}
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Ms">Ms</option>
          <option value="Miss">Miss</option>
          <option value="Dr">Dr</option>
        </select>
        <span className="error-msg" role="alert">{errors.title || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="firstName">First Name <span className="required">*</span></label>
        <input
          id="firstName"
          className={errClass("firstName")}
          value={form.firstName}
          onChange={(e) => updateField("firstName", e.target.value.replace(/[^A-Za-z\s\-\u2013]/g, ""))}
        />
        <span className="error-msg" role="alert">{errors.firstName || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="lastName">Last Name <span className="required">*</span></label>
        <input
          id="lastName"
          className={errClass("lastName")}
          value={form.lastName}
          onChange={(e) => updateField("lastName", e.target.value.replace(/[^A-Za-z\s\-\u2013]/g, ""))}
        />
        <span className="error-msg" role="alert">{errors.lastName || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="street">Street <span className="required">*</span></label>
        <input
          id="street"
          className={errClass("street")}
          value={form.street}
          onChange={(e) => updateField("street", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.street || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="suburb">Suburb</label>
        <input
          id="suburb"
          value={form.suburb}
          onChange={(e) => updateField("suburb", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="city">City <span className="required">*</span></label>
        <input
          id="city"
          className={errClass("city")}
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.city || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="postCode">Post Code <span className="required">*</span></label>
        <input
          id="postCode"
          className={errClass("postCode")}
          maxLength={4}
          inputMode="numeric"
          value={form.postCode}
          onChange={(e) => updateField("postCode", e.target.value.replace(/\D/g, "").slice(0, 4))}
        />
        <span className="error-msg" role="alert">{errors.postCode || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="phone">Phone Number <span className="required">*</span></label>
        <input
          id="phone"
          type="tel"
          className={errClass("phone")}
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value.replace(/[^0-9\s()\-+]/g, ""))}
        />
        <span className="error-msg" role="alert">{errors.phone || ""}</span>
      </div>

      <div className="field">
        <label htmlFor="email">Email <span className="required">*</span></label>
        <input
          id="email"
          type="email"
          className={errClass("email")}
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <span className="error-msg" role="alert">{errors.email || ""}</span>
      </div>
    </section>
  );
}

export default forwardRef(FormCustomerDetail);
