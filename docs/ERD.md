# Sonita Guest House — Entity-Relationship Diagram

Written in **DBML** so it can be pasted directly into [dbdiagram.io](https://dbdiagram.io) for a
visual diagram. Generated directly from the actual Laravel migrations in `database/migrations/`
(not hand-drawn), so it always matches what's really in the database. Covers the 15 domain tables;
Laravel/Fortify infrastructure tables (`sessions`, `cache`, `jobs`, `password_reset_tokens`,
`passkeys`) are omitted since they aren't part of the application's own data model.

## Diagram (paste this block into dbdiagram.io)

```dbml
Enum user_role {
  admin
  receptionist
  housekeeping
  guest
}

Enum rental_mode {
  short_stay
  long_stay
  both
}

Enum room_status {
  available
  occupied
  reserved
  cleaning
  maintenance
}

Enum reservation_type {
  short_stay
  long_stay
}

Enum reservation_status {
  pending
  confirmed
  checked_in
  checked_out
  active
  expired
  cancelled
  terminated
}

Enum invoice_type {
  short_stay
  long_stay
}

Enum invoice_status {
  unpaid
  partial
  paid
}

Enum payment_method {
  cash
  bank_transfer
  qr
}

Enum payment_status {
  pending
  confirmed
  failed
  refunded
}

Enum maintenance_priority {
  low
  medium
  high
}

Enum maintenance_status {
  pending
  in_progress
  resolved
  cancelled
}

Enum stay_type {
  short_stay
  long_stay
}

Enum discount_type {
  percent
  fixed
}

Table users {
  id uuid [pk]
  role user_role
  full_name varchar
  email varchar [unique]
  phone_number varchar
  id_card_image varchar
  email_verified_at timestamp
  password varchar
  two_factor_secret text [note: 'nullable']
  two_factor_recovery_codes text [note: 'nullable']
  two_factor_confirmed_at timestamp [note: 'nullable']
  remember_token varchar
  created_at timestamp
  updated_at timestamp

  Note: 'A user has exactly one role.'
}

Table rooms {
  id uuid [pk]
  room_number varchar [unique]
  room_type varchar
  rental_mode rental_mode
  price_per_night decimal
  price_per_month decimal
  status room_status
  floor int
  max_occupants int
  amenities text
  description text
  notes text [note: 'nullable']
  created_at timestamp
  updated_at timestamp
}

Table room_images {
  id uuid [pk]
  room_id uuid [ref: > rooms.id]
  image_path varchar
  created_at timestamp
  updated_at timestamp
}

Table reservations {
  id uuid [pk]
  guest_id uuid [ref: > users.id]
  room_id uuid [ref: > rooms.id]
  reservation_type reservation_type
  check_in_date date [note: 'short-stay only']
  check_out_date date [note: 'short-stay only']
  start_date date [note: 'long-stay only']
  end_date date [note: 'long-stay only, nullable (open-ended)']
  deposit_amount decimal
  monthly_due_day int [note: 'long-stay only']
  num_guests int
  status reservation_status
  notes text [note: 'nullable']
  promo_code varchar [note: 'nullable, captured at booking time']
  created_at timestamp
  updated_at timestamp
}

Table services {
  id uuid [pk]
  name varchar
  price decimal
  created_at timestamp
  updated_at timestamp
}

Table reservation_service {
  id uuid [pk]
  reservation_id uuid [ref: > reservations.id]
  service_id uuid [ref: > services.id]
  quantity int
  unit_price decimal [note: 'price snapshotted at attach time']
  created_at timestamp
  updated_at timestamp

  Note: 'Junction table for the reservations <> services many-to-many.'
}

Table invoices {
  id uuid [pk]
  reservation_id uuid [ref: > reservations.id]
  invoice_type invoice_type
  billing_period date
  room_charge decimal
  service_charge decimal
  utility_charge decimal
  elec_meter_start decimal
  elec_meter_end decimal
  water_meter_start decimal
  water_meter_end decimal
  tax_amount decimal
  discount_amount decimal [default: 0, note: 'promo code discount, applied pre-tax']
  total_amount decimal
  status invoice_status
  due_date date
  created_at timestamp
  updated_at timestamp
}

Table payments {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  guest_id uuid [ref: > users.id]
  amount decimal
  method payment_method
  proof_image varchar [note: 'nullable']
  status payment_status
  paid_at timestamp
  created_at timestamp
  updated_at timestamp
}

Table maintenance_requests {
  id uuid [pk]
  reporter_id uuid [ref: > users.id]
  room_id uuid [ref: > rooms.id]
  title varchar
  description text
  priority maintenance_priority
  status maintenance_status
  assigned_to uuid [ref: > users.id, note: 'nullable — housekeeping staff']
  resolved_at timestamp
  created_at timestamp
  updated_at timestamp
}

Table notifications {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  type varchar
  message text
  data json [note: 'nullable']
  link varchar
  is_read boolean
  created_at timestamp
  updated_at timestamp
}

Table settings {
  id uuid [pk]
  currency varchar
  tax_rate decimal
  default_checkin_time time
  default_checkout_time time
  electric_rate decimal
  water_rate decimal
  late_fee decimal
  payment_qr_url varchar
  payment_instruction text
  created_at timestamp
  updated_at timestamp

  Note: 'Singleton table — the app expects exactly one row.'
}

Table reviews {
  id uuid [pk]
  reservation_id uuid [ref: - reservations.id, note: 'unique — one review per stay']
  guest_id uuid [ref: > users.id]
  rating int [note: '1-5, unsignedTinyInteger']
  comment text [note: 'nullable']
  created_at timestamp
  updated_at timestamp

  Note: 'Only writable for a short-stay reservation that has reached checked_out.'
}

Table waitlist_entries {
  id uuid [pk]
  email varchar
  phone_number varchar [note: 'nullable']
  stay_type stay_type
  from_date date [note: 'nullable']
  to_date date [note: 'nullable']
  notified_at timestamp [note: 'nullable, stamped when admin sends the notify email']
  created_at timestamp
  updated_at timestamp

  Note: 'No FK to users — captures anonymous visitors, not just registered guests.'
}

Table activity_logs {
  id uuid [pk]
  causer_id uuid [ref: > users.id, note: 'nullable, nullOnDelete']
  action varchar [note: 'e.g. room.created, reservation.checked_in']
  subject_type varchar
  subject_id uuid [note: 'polymorphic pair with subject_type, no FK']
  description varchar
  properties json [note: 'nullable']
  created_at timestamp [note: 'no updated_at — log rows are write-once']

  indexes {
    (subject_type, subject_id)
  }
}

Table promo_codes {
  id uuid [pk]
  code varchar [unique]
  discount_type discount_type
  discount_value decimal
  active boolean [default: true]
  expires_at date [note: 'nullable']
  max_uses int [note: 'nullable — unlimited if empty']
  used_count int [default: 0]
  created_at timestamp
  updated_at timestamp

  Note: 'No FK from reservations — reservations.promo_code stores the code string, looked up here at invoice time.'
}
```

## Notes

- All primary keys are **UUIDs** (`HasUuids`), not auto-incrementing integers — a deliberate
  choice to prevent ID-guessing/enumeration on public-facing records.
- `reservation_service` is a genuine junction table (with its own `id`, plus `quantity` and a
  snapshotted `unit_price`) resolving the many-to-many between `reservations` and `services` — not
  a simple pivot without a model.
- `maintenance_requests` has **two** relationships to `users`: `reporter_id` (who filed it) and
  `assigned_to` (which housekeeping staff it's assigned to, nullable until an admin assigns it).
- `settings` is a singleton table (the app expects exactly one row) and has no foreign keys — it
  holds business-wide configuration (currency, tax rate, utility billing rates, etc.), not
  per-record data.
- `reviews.reservation_id` has a **unique** constraint — one review per stay, enforced at the
  database level (not just app-level validation), and only writable for a short-stay reservation
  that has already reached `checked_out`.
- `waitlist_entries` has no foreign key to `users` — an entry is just an email/phone captured from
  an anonymous visitor searching for a fully-booked date range, not necessarily a registered guest.
- `activity_logs` uses a **polymorphic-style** pair (`subject_type` + `subject_id`) instead of a
  foreign key, since one activity log table records events across several different model types
  (rooms, reservations, staff accounts, payments, settings) rather than one fixed relation.
  `causer_id` is nullable and `nullOnDelete` so the log entry survives even if the staff account
  that caused it is later deleted. It has no `updated_at` (log rows are write-once).
- `promo_codes` has no foreign key either — a reservation just stores the `code` string it was
  booked with (`reservations.promo_code`), looked up against `promo_codes.code` at invoice time,
  so a code can be edited/deleted later without needing to touch past reservations.
- `id_card_image` on `users` and `email_verified_at`/`password`/`remember_token` are present in the
  actual table (see `database/migrations/0001_01_01_000000_create_users_table.php`) and included
  above for completeness.
- `users.two_factor_secret`/`two_factor_recovery_codes`/`two_factor_confirmed_at` back Fortify's
  2FA feature — unlike other Fortify infrastructure (`passkeys`, `sessions`), these are columns on
  the domain `users` table itself, so they're included here rather than omitted.
- `notifications.data` (nullable JSON) carries structured payload for a notification (e.g. IDs to
  build the link/translation params) alongside the human-readable `message`.
- `rooms.notes` and `reservations.notes` are free-text staff annotations, distinct from the
  guest-facing `description`/room fields.
