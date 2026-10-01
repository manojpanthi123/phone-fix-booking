-- Run this in the Supabase SQL editor, then put the project URL and anon key
-- in react-demo/.env as REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.

create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  job_number text unique not null,
  invoice_at timestamptz not null,
  invoice_display text not null,
  customer_type text not null,
  title text,
  first_name text,
  last_name text,
  street text,
  suburb text,
  city text,
  post_code text,
  phone text,
  email text,
  purchase_date date,
  repair_date date,
  repair_time text,
  repair_display text,
  warranty boolean,
  imei text,
  make text,
  model_number text,
  fault_category text,
  description text,
  courtesy_items jsonb,
  bond numeric,
  service_fee numeric,
  total numeric,
  gst numeric,
  total_gst numeric,
  business jsonb
);

alter table public.bookings enable row level security;

create policy "anon can insert bookings"
  on public.bookings for insert
  to anon
  with check (true);

create policy "anon can read bookings"
  on public.bookings for select
  to anon
  using (true);
