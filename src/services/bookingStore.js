import { createClient } from "@supabase/supabase-js";
import {
  BUSINESS,
  createJobNumber,
  formatInvoiceDate,
  formatRepairDateTime
} from "../utils/helpers";

const STORAGE_KEY = "phoneFixBookings";

/**
 * Supabase is used when both values are set in react-demo/.env
 * REACT_APP_SUPABASE_URL
 * REACT_APP_SUPABASE_ANON_KEY
 * Otherwise bookings are kept in this browser so the job sheet still works.
 */
function supabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeLocal(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function toRow(booking) {
  return {
    job_number: booking.jobNumber,
    invoice_date: booking.invoiceDisplay,
    customer_type: booking.customer.customerType,
    title: booking.customer.title,
    first_name: booking.customer.firstName,
    last_name: booking.customer.lastName,
    street: booking.customer.street,
    suburb: booking.customer.suburb,
    city: booking.customer.city,
    post_code: booking.customer.postCode,
    phone: booking.customer.phone,
    email: booking.customer.email,
    purchase_date: booking.repair.purchaseDate,
    repair_date: booking.repair.repairDate,
    repair_time: booking.repair.repairTime,
    repair_date_time: booking.repairDisplay,
    warranty: booking.repair.warranty,
    imei: booking.repair.imei,
    make: booking.repair.make,
    model_number: booking.repair.modelNumber,
    fault_category: booking.repair.faultCategory,
    description: booking.repair.description,
    courtesy_items: booking.courtesyItems,
    bond: booking.costs.bond,
    service_fee: booking.costs.serviceFee,
    total: booking.costs.total,
    gst: booking.costs.gst,
    total_gst: booking.costs.totalGst
  };
}

function fromRow(row) {
  return {
    jobNumber: row.job_number,
    invoiceAt: row.created_at || row.invoice_date,
    invoiceDisplay: row.invoice_date,
    repairDisplay: row.repair_date_time,
    customer: {
      customerType: row.customer_type,
      title: row.title,
      firstName: row.first_name,
      lastName: row.last_name,
      street: row.street,
      suburb: row.suburb,
      city: row.city,
      postCode: row.post_code,
      phone: row.phone,
      email: row.email
    },
    repair: {
      purchaseDate: row.purchase_date,
      repairDate: row.repair_date,
      repairTime: row.repair_time,
      warranty: row.warranty,
      imei: row.imei,
      make: row.make,
      modelNumber: row.model_number,
      faultCategory: row.fault_category,
      description: row.description
    },
    courtesyItems: row.courtesy_items || [],
    costs: {
      bond: Number(row.bond),
      serviceFee: Number(row.service_fee),
      total: Number(row.total),
      gst: Number(row.gst),
      totalGst: Number(row.total_gst)
    },
    business: row.business || BUSINESS,
    storedIn: "supabase"
  };
}

/** Turn a stored row back into the object Home passes through the router. */
export function bookingToAttached(booking) {
  return {
    sharedBond: booking.costs.bond,
    sharedWarranty: Boolean(booking.repair.warranty),
    sharedCustomerType: booking.customer.customerType !== "business",
    customerDetails: {
      title: booking.customer.title,
      firstname: booking.customer.firstName,
      lastname: booking.customer.lastName,
      street: booking.customer.street,
      suburb: booking.customer.suburb,
      city: booking.customer.city,
      postCode: booking.customer.postCode,
      phone: booking.customer.phone,
      email: booking.customer.email
    },
    repairDetails: booking.repair,
    courtesyItems: booking.courtesyItems || [],
    costs: booking.costs,
    jobNumber: booking.jobNumber,
    invoiceDisplay: booking.invoiceDisplay,
    repairDisplay: booking.repairDisplay,
    business: booking.business || BUSINESS,
    storedIn: booking.storedIn
  };
}

export function buildBooking(customer, repair, courtesy, costs) {
  const now = new Date();
  const courtesyItems = [courtesy.phone, courtesy.charger]
    .filter(Boolean)
    .map((item) => ({ name: item.name, bond: item.bond, type: item.type }));

  return {
    jobNumber: createJobNumber(),
    invoiceAt: now.toISOString(),
    invoiceDisplay: formatInvoiceDate(now),
    repairDisplay: formatRepairDateTime(repair.repairDate, repair.repairTime),
    customer,
    repair,
    courtesyItems,
    costs,
    business: BUSINESS,
    storedIn: "browser"
  };
}

export async function saveBooking(booking) {
  const client = supabaseClient();
  if (client) {
    const { data, error } = await client
      .from("bookings")
      .insert(toRow(booking))
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    const saved = fromRow(data);
    const rest = readLocal().filter((item) => item.jobNumber !== saved.jobNumber);
    writeLocal([saved, ...rest]);
    return saved;
  }

  const saved = { ...booking, storedIn: "browser" };
  writeLocal([saved, ...readLocal()]);
  return saved;
}

export async function listBookings() {
  const client = supabaseClient();
  if (client) {
    const { data, error } = await client
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return (data || []).map(fromRow);
  }
  return readLocal();
}
