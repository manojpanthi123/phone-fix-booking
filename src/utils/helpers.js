/** Courtesy items from the assignment brief */
export const courtesyList = [
  { id: 0, type: "none", name: "none", bond: 0 },
  { id: 1, type: "phone", name: "iphone 10", bond: 275 },
  { id: 2, type: "phone", name: "iphone 14", bond: 300 },
  { id: 3, type: "phone", name: "iphone 16", bond: 500 },
  { id: 4, type: "phone", name: "samsung galaxy", bond: 200 },
  { id: 5, type: "phone", name: "nokia", bond: 150 },
  { id: 6, type: "phone", name: "xiaomi", bond: 100 },
  { id: 7, type: "charger", name: "iphone charger", bond: 45 },
  { id: 8, type: "charger", name: "samsung charger", bond: 30 },
  { id: 9, type: "charger", name: "nokia charger", bond: 25 },
  { id: 10, type: "charger", name: "xiaomi", bond: 25 }
];

export const SERVICE_FEE = 85;
export const GST_RATE = 0.15;

export function formatMoney(amount) {
  return "$" + Number(amount).toFixed(2);
}

export function todayISO() {
  const now = new Date();
  return (
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0")
  );
}

export function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function parseISODate(value) {
  if (!value) return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

export function monthsSince(purchaseDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let months =
    (today.getFullYear() - purchaseDate.getFullYear()) * 12 +
    (today.getMonth() - purchaseDate.getMonth());
  if (today.getDate() < purchaseDate.getDate()) {
    months -= 1;
  }
  return months;
}

export function findItem(id) {
  return courtesyList.find((item) => item.id === Number(id)) || courtesyList[0];
}

/** Shop details printed on every repair booking job sheet. */
export const BUSINESS = {
  name: "PHONE FIX SERVICES",
  addressLine1: "501 Gloucester Street",
  addressLine2: "Taradale, Napier 4112",
  phone: "06 974 8000",
  email: "bookings@phonefix.co.nz"
};

function pad(value) {
  return String(value).padStart(2, "0");
}

/** Invoice date and time in 24-hour format, for example 02/10/2026 13:05. */
export function formatInvoiceDate(date) {
  return (
    pad(date.getDate()) + "/" +
    pad(date.getMonth() + 1) + "/" +
    date.getFullYear() + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes())
  );
}

/** Repair date plus time in 12-hour form, for example 03/10/2026 1:05 PM. */
export function formatRepairDateTime(isoDate, timeValue) {
  const parts = (isoDate || "").split("-");
  const day = parts[2] || "";
  const month = parts[1] || "";
  const year = parts[0] || "";
  const bits = (timeValue || "").split(":");
  let hours = Number(bits[0]);
  const minutes = bits[1] || "00";
  if (Number.isNaN(hours)) return day + "/" + month + "/" + year;
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return day + "/" + month + "/" + year + " " + hours + ":" + minutes + " " + suffix;
}

export function createJobNumber() {
  return "PF-" + Date.now().toString(36).toUpperCase();
}
