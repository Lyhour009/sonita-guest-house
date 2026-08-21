# Sonita Guest House — Entity-Relationship Diagram

Generated directly from the actual Laravel migrations in `database/migrations/` (not hand-drawn),
so it always matches what's really in the database. Covers the 11 domain tables; Laravel/Fortify
infrastructure tables (`sessions`, `cache`, `jobs`, `password_reset_tokens`, `passkeys`) are
omitted since they aren't part of the application's own data model.

## Diagram

```mermaid
erDiagram
    USERS ||--o{ RESERVATIONS : "makes"
    USERS ||--o{ PAYMENTS : "submits"
    USERS ||--o{ MAINTENANCE_REQUESTS : "reports"
    USERS ||--o{ MAINTENANCE_REQUESTS : "is assigned"
    USERS ||--o{ NOTIFICATIONS : "receives"
    ROOMS ||--o{ ROOM_IMAGES : "has"
    ROOMS ||--o{ RESERVATIONS : "is booked in"
    ROOMS ||--o{ MAINTENANCE_REQUESTS : "has issue reported on"
    RESERVATIONS ||--o{ INVOICES : "generates"
    RESERVATIONS ||--o{ RESERVATION_SERVICE : "includes"
    SERVICES ||--o{ RESERVATION_SERVICE : "included in"
    INVOICES ||--o{ PAYMENTS : "is paid by"

    USERS {
        uuid id PK
        enum role "admin, receptionist, housekeeping, guest"
        string full_name
        string email UK
        string phone_number
        string id_card_image
        timestamp email_verified_at
        string password
    }

    ROOMS {
        uuid id PK
        string room_number UK
        string room_type
        enum rental_mode "short_stay, long_stay, both"
        decimal price_per_night
        decimal price_per_month
        enum status "available, occupied, reserved, cleaning, maintenance"
        int floor
        int max_occupants
        text amenities
        text description
    }

    ROOM_IMAGES {
        uuid id PK
        uuid room_id FK
        string image_path
    }

    RESERVATIONS {
        uuid id PK
        uuid guest_id FK
        uuid room_id FK
        enum reservation_type "short_stay, long_stay"
        date check_in_date
        date check_out_date
        date start_date
        date end_date
        decimal deposit_amount
        int monthly_due_day
        int num_guests
        enum status "pending, confirmed, checked_in, checked_out, active, expired, cancelled, terminated"
    }

    SERVICES {
        uuid id PK
        string name
        decimal price
    }

    RESERVATION_SERVICE {
        uuid id PK
        uuid reservation_id FK
        uuid service_id FK
        int quantity
    }

    INVOICES {
        uuid id PK
        uuid reservation_id FK
        enum invoice_type "short_stay, long_stay"
        date billing_period
        decimal room_charge
        decimal service_charge
        decimal utility_charge
        decimal elec_meter_start
        decimal elec_meter_end
        decimal water_meter_start
        decimal water_meter_end
        decimal tax_amount
        decimal total_amount
        enum status "unpaid, partial, paid"
        date due_date
    }

    PAYMENTS {
        uuid id PK
        uuid invoice_id FK
        uuid guest_id FK
        decimal amount
        string method "cash, bank_transfer, qr"
        string proof_image
        enum status "pending, confirmed, failed, refunded"
        timestamp paid_at
    }

    MAINTENANCE_REQUESTS {
        uuid id PK
        uuid reporter_id FK
        uuid room_id FK
        string title
        text description
        enum priority "low, medium, high"
        enum status "pending, in_progress, resolved, cancelled"
        uuid assigned_to FK
        timestamp resolved_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type
        text message
        string link
        boolean is_read
    }

    SETTINGS {
        uuid id PK
        string currency
        decimal tax_rate
        time default_checkin_time
        time default_checkout_time
        decimal electric_rate
        decimal water_rate
        decimal late_fee
        string payment_qr_url
        text payment_instruction
    }
```

## Notes

- All primary keys are **UUIDs** (`HasUuids`), not auto-incrementing integers — a deliberate
  choice to prevent ID-guessing/enumeration on public-facing records.
- `RESERVATION_SERVICE` is a genuine junction table (with its own `id`, plus `quantity`) resolving
  the many-to-many between `RESERVATIONS` and `SERVICES` — not a simple pivot without a model.
- `MAINTENANCE_REQUESTS` has **two** relationships to `USERS`: `reporter_id` (who filed it) and
  `assigned_to` (which housekeeping staff it's assigned to, nullable until an admin assigns it).
- `SETTINGS` is a singleton table (the app expects exactly one row) and has no foreign keys — it
  holds business-wide configuration (currency, tax rate, utility billing rates, etc.), not
  per-record data.
- `id_card_image` on `USERS` and `email_verified_at`/`password`/`remember_token` are omitted from
  the diagram's enum/type annotations above where not relevant to the data model, but are present
  in the actual table (see `database/migrations/0001_01_01_000000_create_users_table.php`).

## Column reference

### Identity & access

**users** — `id` PK · `role` enum(admin/receptionist/housekeeping/guest) · `full_name` ·
`email` UK · `phone_number` · `id_card_image` · `email_verified_at` · `password` ·
`remember_token` · timestamps

### Property

**rooms** — `id` PK · `room_number` UK · `room_type` · `rental_mode` enum(short_stay/long_stay/both) ·
`price_per_night` · `price_per_month` · `status` enum(available/occupied/reserved/cleaning/maintenance) ·
`floor` · `max_occupants` · `amenities` · `description` · timestamps

**room_images** — `id` PK · `room_id` FK → rooms · `image_path` · timestamps

### Reservations

**reservations** — `id` PK · `guest_id` FK → users · `room_id` FK → rooms ·
`reservation_type` enum(short_stay/long_stay) · `check_in_date` · `check_out_date` ·
`start_date` · `end_date` · `deposit_amount` · `monthly_due_day` · `num_guests` ·
`status` enum(pending/confirmed/checked_in/checked_out/active/expired/cancelled/terminated) ·
timestamps

**services** — `id` PK · `name` · `price` · timestamps

**reservation_service** — `id` PK · `reservation_id` FK → reservations · `service_id` FK → services ·
`quantity` · timestamps

### Billing

**invoices** — `id` PK · `reservation_id` FK → reservations · `invoice_type` enum(short_stay/long_stay) ·
`billing_period` · `room_charge` · `service_charge` · `utility_charge` · `elec_meter_start` ·
`elec_meter_end` · `water_meter_start` · `water_meter_end` · `tax_amount` · `total_amount` ·
`status` enum(unpaid/partial/paid) · `due_date` · timestamps

**payments** — `id` PK · `invoice_id` FK → invoices · `guest_id` FK → users · `amount` ·
`method` (cash/bank_transfer/qr) · `proof_image` · `status` enum(pending/confirmed/failed/refunded) ·
`paid_at` · timestamps

### Operations

**maintenance_requests** — `id` PK · `reporter_id` FK → users · `room_id` FK → rooms · `title` ·
`description` · `priority` enum(low/medium/high) · `status` enum(pending/in_progress/resolved/cancelled) ·
`assigned_to` FK → users (nullable) · `resolved_at` · timestamps

**notifications** — `id` PK · `user_id` FK → users · `type` · `message` · `link` · `is_read` ·
timestamps

### Configuration

**settings** — `id` PK · `currency` · `tax_rate` · `default_checkin_time` · `default_checkout_time` ·
`electric_rate` · `water_rate` · `late_fee` · `payment_qr_url` · `payment_instruction` · timestamps
