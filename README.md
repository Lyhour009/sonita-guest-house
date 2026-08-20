# Sonita Guest House Management System

A Laravel + Inertia.js + React guest house management system: room browsing and booking,
short-stay and long-stay reservations, billing and payments, maintenance and housekeeping,
in-app notifications, and role-based dashboards for admin, receptionist, housekeeping, and guest
users.

Built following `docs/BUILD_SPEC_Sonita_Guest_House.md`.

## Stack

Laravel 13 (PHP 8.3) · Inertia.js v3 · React 19 · TypeScript · Tailwind v4 · shadcn/ui ·
Laravel Fortify (headless auth) · Laravel Wayfinder (typed routes/actions) · Pest.

## Setup

1. Install dependencies:
   ```bash
   composer install
   npm install
   ```
2. Copy the environment file and generate an app key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   The default `.env.example` uses SQLite — create the database file if it doesn't already exist:
   ```bash
   touch database/database.sqlite
   ```
   (To use MySQL/Postgres instead, update the `DB_*` variables in `.env`.)
3. Run migrations and seed demo data:
   ```bash
   php artisan migrate --seed
   ```
4. Link the public storage disk (needed for room images):
   ```bash
   php artisan storage:link
   ```
5. Start the app. Either run everything concurrently:
   ```bash
   composer dev
   ```
   or run the pieces separately:
   ```bash
   php artisan serve
   npm run dev
   ```

The app is then available at `http://localhost:8000` (or whatever `APP_URL`/`php artisan serve`
reports).

## Running tests

```bash
composer test
```

This clears the config cache, then runs Pint (formatting), PHPStan/Larastan level 7 (static
analysis), and the full Pest test suite. For a single test:

```bash
php artisan test --compact --filter=testName
```

Frontend checks:

```bash
npm run types:check   # tsc --noEmit
npm run lint:check    # ESLint
npm run format:check  # Prettier
npm run build         # production build
```

## Demo login credentials

`php artisan migrate --seed` creates one account per role, plus a realistic set of reservations,
invoices, payments, maintenance requests, and notifications so every page has something to show
immediately. All seeded accounts share the password **`password`**.

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@example.com` | Full access — rooms, invoices, services, staff accounts, settings, reports dashboard. |
| Receptionist | `receptionist@sonita.com` | Front-desk: reservations, payments, room status. |
| Housekeeping | `housekeeping@sonita.com` | Room-cleaning board and assigned maintenance requests. |
| Guest | `guest@sonita.com` | Has a completed stay with a partially-paid invoice, an active reservation, and a few notifications. |

A few additional anonymous guest accounts (random emails, same `password`) are also seeded for
volume — see `database/seeders/DatabaseSeeder.php`.

## Re-seeding

To reset to a clean demo state at any time:

```bash
php artisan migrate:fresh --seed
```

The seeder drives the application's own Action classes (reservation confirmation, check-in/out,
invoice generation, payment confirmation, maintenance assignment) rather than inserting rows
directly, so the demo data is internally consistent the same way real usage would produce it.

## Project structure

See `CLAUDE.md` for a fuller breakdown of the codebase's architecture and conventions. In short:

- `app/Actions/{Domain}/` — one class per business operation (reservations, invoices, payments,
  maintenance, housekeeping, notifications, staff accounts).
- `app/Http/Controllers/`, `Controllers/Staff/`, `Controllers/Admin/` — thin controllers grouped
  by the role that owns each route.
- `resources/js/pages/` — Inertia pages, mirroring the controller/route structure.
- `resources/js/actions/`, `resources/js/routes/` — Wayfinder-generated typed bindings; do not
  hand-edit, regenerate with `php artisan wayfinder:generate --with-form` after route changes.
