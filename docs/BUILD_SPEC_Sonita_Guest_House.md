# BUILD SPEC — Sonita Guest House Management System
**For: Claude Code (or any coding agent) — read this entire file before writing any code.**
**Deadline: 2 weeks. Priorities are marked. Build in the order given. Do not skip the MVP scope to work on stretch features.**

---

## 0. READ FIRST — Ground Rules for the Agent

1. This is a **university thesis project**. The student failed once already because the system's name/purpose didn't match what was actually built, and the requirements didn't match the database design. **Every feature you build must trace back to a requirement in this document.** Do not invent unrelated features. Do not silently drop features listed here — if something is genuinely not feasible in 2 weeks, flag it instead of skipping it silently.
2. Follow the naming conventions in this doc exactly (table names, field names, route names, model names) — consistency matters for the thesis defense (the student will be asked to explain the ERD, and it must match the running system).
3. Confirm the stack setup (section 1) before scaffolding. If versions differ from what's installed, adapt but keep the same architecture (Laravel API/backend + Inertia React frontend, or separate REST API + React SPA — pick one and stay consistent; recommendation is Inertia.js since it's what the official Laravel React starter kit uses).
4. Work incrementally: after each module (section 6), the app should run and be demo-able. Do not leave the app in a broken state between modules.
5. Write seed data (section 9) early — the student needs a populated demo for the defense, not just an empty schema.

---

## 1. Tech Stack

- **Backend:** Laravel 11/12
- **Frontend:** React (via Laravel's official React starter kit — Inertia.js + TypeScript + Tailwind CSS + shadcn/ui components)
- **Database:** MySQL
- **Auth:** Laravel Breeze/Fortify (bundled with the React starter kit) — email + password login, role-based access via a `role` column + middleware
- **File uploads** (ID card images, payment proof images, room images): stored via Laravel's `storage` disk (local for dev; note in report that production would use S3-compatible storage)

If the project hasn't been initialized yet, the agent should run:
```
laravel new sonita-guest-house --react
```
(or `composer create-project laravel/laravel` + manually install the React starter kit — whichever is available in the environment)

---

## 2. Project Identity (must stay consistent everywhere: code, UI text, report)

- **System name:** Sonita Guest House Management System
- **Business type:** Guest house offering BOTH short-stay (nightly) bookings AND long-stay (monthly) rentals — this hybrid nature is the core concept. Do not let the implementation drift toward only one type.
- **Location (for seed/demo data):** Street 644, Sangkat Chak Angre Ti 1, Khan Chak Angre, Phnom Penh

---

## 3. User Roles & Auth

| Role (`users.role`) | Access |
|---|---|
| `admin` | Full access to everything |
| `receptionist` | Front-desk module: reservations, check-in/out, payments, room status view |
| `housekeeping` | Room status updates only (cleaning/maintenance), maintenance requests assigned to them |
| `guest` | Self-service: browse rooms, book, view own reservations/invoices/payments, submit maintenance requests |

Implement:
- Standard Laravel auth (register/login/logout) from the starter kit.
- `role` enum column on `users` table.
- Middleware (e.g. `EnsureUserHasRole`) to protect routes per role.
- Registration form is for **guests only** (self-signup). Admin creates receptionist/housekeeping accounts from an admin panel (Admin → Staff → Add Staff).
- Seed one admin account by default: `admin@sonita.com` / `password` (document this in the README for the demo).

---

## 4. Database Schema (build these as Laravel migrations, in this order — respects FK dependencies)

Use `uuid` primary keys (`$table->uuid('id')->primary();`) for all tables below, consistent with the design. Use Laravel's native `enum` string columns (`$table->enum('status', [...])`) unless the agent prefers a `string` + validation — pick one and be consistent across all tables.

### 4.1 `users`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| role | enum('admin','receptionist','housekeeping','guest') | default 'guest' |
| full_name | string | |
| email | string, unique | |
| phone_number | string, nullable | |
| id_card_image | string, nullable | file path |
| password | string | hashed |
| email_verified_at | timestamp, nullable | Laravel default |
| remember_token | string, nullable | Laravel default |
| timestamps | created_at, updated_at | |

### 4.2 `rooms`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| room_number | string, unique | |
| room_type | string | e.g. "Standard", "Deluxe" |
| rental_mode | enum('short_stay','long_stay','both') | default 'both' |
| price_per_night | decimal(10,2) | |
| price_per_month | decimal(10,2) | |
| status | enum('available','occupied','reserved','cleaning','maintenance') | default 'available' |
| floor | integer, nullable | |
| max_occupants | integer, default 1 | |
| amenities | text, nullable | store as comma-separated or JSON |
| description | text, nullable | |
| timestamps | | |

### 4.3 `room_images` *(separate table, not a single column — allows multiple images per room)*
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| room_id | uuid, FK → rooms.id, cascade delete | |
| image_path | string | |
| timestamps | | |

### 4.4 `reservations`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| guest_id | uuid, FK → users.id | |
| room_id | uuid, FK → rooms.id | |
| reservation_type | enum('short_stay','long_stay') | |
| check_in_date | date, nullable | short_stay |
| check_out_date | date, nullable | short_stay |
| start_date | date, nullable | long_stay |
| end_date | date, nullable | long_stay, nullable = open-ended |
| deposit_amount | decimal(10,2), nullable | mainly long_stay |
| monthly_due_day | integer, nullable | long_stay only |
| num_guests | integer, nullable | short_stay |
| status | enum('pending','confirmed','checked_in','checked_out','active','expired','cancelled','terminated') | |
| timestamps | | |

### 4.5 `services`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | string | e.g. Breakfast, Laundry, Airport Pickup |
| price | decimal(10,2) | |
| timestamps | | |

### 4.6 `reservation_service` *(pivot table)*
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| reservation_id | uuid, FK → reservations.id, cascade delete | |
| service_id | uuid, FK → services.id | |
| quantity | integer, default 1 | |
| timestamps | | |

### 4.7 `invoices`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| reservation_id | uuid, FK → reservations.id | |
| invoice_type | enum('short_stay','long_stay') | mirrors reservation |
| billing_period | date, nullable | long_stay monthly cycle marker (e.g. first of month) |
| room_charge | decimal(10,2) | |
| service_charge | decimal(10,2), default 0 | |
| utility_charge | decimal(10,2), nullable | long_stay only |
| elec_meter_start | decimal(10,2), nullable | |
| elec_meter_end | decimal(10,2), nullable | |
| water_meter_start | decimal(10,2), nullable | |
| water_meter_end | decimal(10,2), nullable | |
| tax_amount | decimal(10,2), default 0 | |
| total_amount | decimal(10,2) | |
| status | enum('unpaid','partial','paid') | default 'unpaid' |
| due_date | date, nullable | |
| timestamps | | |

### 4.8 `payments`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| invoice_id | uuid, FK → invoices.id | |
| guest_id | uuid, FK → users.id | |
| amount | decimal(10,2) | |
| method | string | cash / bank_transfer / qr |
| proof_image | string, nullable | |
| status | enum('pending','confirmed','failed','refunded') | default 'pending' |
| paid_at | timestamp, nullable | |
| timestamps | | |

### 4.9 `maintenance_requests`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| reporter_id | uuid, FK → users.id | |
| room_id | uuid, FK → rooms.id | |
| title | string | |
| description | text, nullable | |
| priority | enum('low','medium','high') | default 'medium' |
| status | enum('pending','in_progress','resolved','cancelled') | default 'pending' |
| assigned_to | uuid, FK → users.id, nullable | |
| resolved_at | timestamp, nullable | |
| timestamps | | |

### 4.10 `notifications` *(custom table — not Laravel's built-in notifications, to keep it simple/visible for the thesis)*
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| type | string | |
| message | text | |
| link | string, nullable | |
| is_read | boolean, default false | |
| timestamps | | |

### 4.11 `settings` *(single row table)*
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| currency | string, default 'USD' | |
| tax_rate | decimal(5,2), default 0 | percentage |
| default_checkin_time | time, default '14:00' | |
| default_checkout_time | time, default '12:00' | |
| electric_rate | decimal(10,2), default 0 | per unit |
| water_rate | decimal(10,2), default 0 | per unit |
| late_fee | decimal(10,2), default 0 | |
| payment_qr_url | string, nullable | |
| payment_instruction | text, nullable | |
| timestamps | | |

### Eloquent relationships to define
- `User hasMany Reservations` (as guest), `hasMany MaintenanceRequests` (as reporter), `hasMany MaintenanceRequests` (as assignee — use a second relation name `assignedMaintenanceRequests`), `hasMany Payments`, `hasMany Notifications`
- `Room hasMany Reservations`, `hasMany RoomImages`, `hasMany MaintenanceRequests`
- `Reservation belongsTo User (guest)`, `belongsTo Room`, `hasMany Invoices`, `belongsToMany Services` (through `reservation_service`)
- `Invoice belongsTo Reservation`, `hasMany Payments`
- `Payment belongsTo Invoice`, `belongsTo User (guest)`
- `MaintenanceRequest belongsTo Room`, `belongsTo User (reporter)`, `belongsTo User (assignee)`
- `Settings` — just fetch the single row (`Settings::first()`), no relationships

---

## 5. Business Logic Rules (must be implemented correctly — these are the parts a thesis panel will test)

1. **No double-booking:** Before confirming a reservation, check that no other reservation on the same room overlaps the requested date range and has status in `(pending, confirmed, checked_in, active)`.
2. **Short-stay invoice generation:** On check-out, generate ONE invoice = `nights × price_per_night + sum(service charges) + tax`.
3. **Long-stay invoice generation:** On a scheduled/manual trigger (monthly), generate an invoice per active long-stay reservation = `price_per_month + utility_charge (computed from meter readings × rates) + tax − late_fee logic if applicable`.
4. **Room status auto-updates:**
   - Reservation confirmed → room becomes `reserved` (short_stay) around check-in, or `occupied` immediately (long_stay, since tenant moves in).
   - Check-in → room becomes `occupied`.
   - Check-out → room becomes `cleaning` (not `available` yet — housekeeping must mark it clean first).
   - Housekeeping marks cleaned → room becomes `available`.
   - Maintenance reported → room becomes `maintenance` (admin/staff decision — can be automatic or manual, agent's choice, document which).
5. **Invoice status:** `unpaid` (no payments) → `partial` (sum of confirmed payments < total) → `paid` (sum of confirmed payments ≥ total). Recalculate on every confirmed payment.
6. **Payment confirmation:** Guest submits payment as `pending`; only `admin` or `receptionist` can change status to `confirmed`/`failed`/`refunded`.
7. **Role enforcement:** Guests can only ever see/edit their own reservations, invoices, payments, maintenance requests — enforce via query scoping (`where('guest_id', auth()->id())`) AND route middleware, not just hiding UI elements.

---

## 6. Build Order (modules) — build and verify each before moving to the next

**Module 1 — Foundation (Day 1–2)**
- Laravel + React starter kit installed and running
- All migrations (section 4) + models + relationships
- Auth (register as guest, login, logout) working
- Role middleware working
- Seed: 1 admin, 2 receptionist/housekeeping, 3 guest users, 8 rooms (mix of short_stay/long_stay/both), 3 services, 1 settings row

**Module 2 — Room Management (Day 3)**
- Admin: CRUD rooms, upload room images, set both pricing tiers, set rental_mode
- Public: browse room listing with availability filter (date range + stay type)

**Module 3 — Reservation Flow (Day 4–6)**
- Guest: create reservation (short_stay with dates, or long_stay with start date/duration), see own reservations
- Receptionist: view all reservations, create walk-in booking, confirm pending ones, check-in / check-out actions
- Enforce no-double-booking rule (section 5.1)
- Room status auto-updates on reservation lifecycle events

**Module 4 — Billing & Payments (Day 7–9)**
- Auto-generate short-stay invoice on checkout
- Manual/admin-triggered long-stay monthly invoice generation (with meter reading input form)
- Guest: view invoices, submit payment (amount, method, proof image upload)
- Admin/Receptionist: confirm/reject payments, invoice status updates automatically

**Module 5 — Maintenance & Housekeeping (Day 10)**
- Guest/staff: submit maintenance request
- Admin: assign to housekeeping staff
- Housekeeping: view assigned requests, update status
- Housekeeping: room status board (mark rooms as cleaned)

**Module 6 — Notifications & Settings (Day 11)**
- Trigger notifications on: reservation confirmed, invoice issued, payment confirmed, maintenance status change
- Simple in-app notification bell/list, mark as read
- Admin settings page (rates, tax, check-in/out time, payment QR/instructions)

**Module 7 — Dashboards & Reports (Day 12)**
- Admin dashboard: occupancy (short vs long stay split), revenue this month, outstanding invoices count, open maintenance count
- Receptionist dashboard: today's arrivals/departures, room status grid
- Guest dashboard: current reservation(s), latest invoice, notifications

**Module 8 — Polish, Testing, Demo Prep (Day 13–14)**
- Fix bugs, responsive check, empty-state handling
- Re-seed clean demo data
- Write README with setup steps + demo login credentials
- **Prepare the thesis artifacts** (see section 8) — these are separate from code but must be ready for defense

---

## 7. Route/Page List (Inertia pages — adjust naming to match starter kit conventions, but keep this structure)

**Public**
- `/` — landing/room browse page (filter by date + stay type)
- `/rooms/{id}` — room detail
- `/login`, `/register` (guest signup only)

**Guest** (`role:guest`)
- `/dashboard` — guest dashboard
- `/reservations` — my reservations (create/view)
- `/invoices` — my invoices
- `/payments` — submit/view payments
- `/maintenance` — submit/view my requests
- `/notifications`

**Receptionist** (`role:receptionist,admin`)
- `/staff/reservations` — all reservations, confirm/check-in/check-out
- `/staff/rooms` — room status grid
- `/staff/payments` — confirm payments

**Housekeeping** (`role:housekeeping,admin`)
- `/staff/housekeeping` — rooms needing cleaning
- `/staff/maintenance` — assigned maintenance requests

**Admin** (`role:admin`)
- `/admin/dashboard`
- `/admin/rooms` — CRUD
- `/admin/staff` — create/manage receptionist & housekeeping accounts
- `/admin/services` — CRUD
- `/admin/reservations` — full oversight
- `/admin/invoices` — generate long-stay invoices, oversight
- `/admin/reports`
- `/admin/settings`

---

## 8. Thesis Deliverables Checklist (not code — but the agent should remind the student / help generate these once the app works)

- [ ] ER Diagram matching the schema in section 4 exactly (regenerate from actual migrations, don't hand-draw a mismatched one)
- [ ] Use Case Diagram per role (Admin, Receptionist, Housekeeping, Guest)
- [ ] System Architecture diagram (React + Inertia + Laravel + MySQL)
- [ ] Screenshots of every major page for the report
- [ ] A short demo script covering: guest books short-stay → receptionist confirms & checks in → checkout generates invoice → guest pays → receptionist confirms payment; AND guest books long-stay → admin generates monthly invoice → guest pays. This script proves the hybrid concept actually works end-to-end — this is the single most important thing to rehearse, since it's exactly what failed last time.

---

## 9. Seed Data Requirements

Seed enough realistic data that the demo doesn't look empty:
- 8–10 rooms, mixed rental_mode
- 3–5 guest accounts
- A few reservations in different statuses (including at least one completed short-stay with a paid invoice, and one active long-stay with an unpaid invoice) so the demo has something to show immediately without manual data entry during the defense.

---

## 10. Assumptions the Agent Should Confirm With the Student (don't guess silently — ask, or pick the safer default and note it in the README)

- Whether reservation confirmation is automatic or requires receptionist/admin approval (default assumption: guest-submitted reservations start as `pending` and need staff confirmation, EXCEPT walk-in bookings created directly by receptionist which are `confirmed` immediately)
- Whether tax is applied to long-stay invoices or short-stay only (default: apply to both, configurable via settings)
- Currency (default: USD, per settings table)
