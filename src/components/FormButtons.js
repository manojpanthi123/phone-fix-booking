import { routerBasename } from "../utils/basename";

function openFaqWindow() {
  const base = routerBasename === "/" ? "" : routerBasename;
  window.open(
    base + "/faq",
    "PhoneFixFAQ",
    "width=860,height=920,scrollbars=yes,resizable=yes"
  );
}

function FormButtons({ status }) {
  return (
    <>
      <div className="form-actions">
        <button type="reset" className="btn btn-action">Reset</button>
        <button type="submit" className="btn btn-action">Submit</button>
        <button type="button" className="btn btn-action" onClick={openFaqWindow}>
          FAQ?
        </button>
      </div>
      <div className={`form-status${status.type ? " " + status.type : ""}`} role="status">
        {status.message}
      </div>
    </>
  );
}

export default FormButtons;
