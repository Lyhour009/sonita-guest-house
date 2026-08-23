# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sonita Guest House is a Laravel + Inertia.js + React guest house management system: public room
browsing/booking, short-stay and long-stay reservations, billing and payments, maintenance and
housekeeping, in-app notifications, and role-based dashboards for **admin**, **receptionist**,
**housekeeping**, and **guest** users. It was built out from the Laravel React Starter Kit (Inertia v3 +
React 19 + Fortify) — see `README.md` for setup/demo-login details and `docs/FEATURES_AND_ROLES.md` for a
full feature-by-role breakdown (the original spec is `docs/BUILD_SPEC_Sonita_Guest_House.md`; the ERD is
`docs/ERD.md`).

## Commands

### PHP / Laravel
- `composer dev` — run the full local dev stack concurrently: `php artisan serve`, queue worker (`queue:listen`), and Vite dev server.
- `composer lint` / `composer lint:check` — Pint formatting (fix / check-only).
- `composer types:check` — PHPStan (Larastan) via `phpstan analyse`, configured at **level 7** (`phpstan.neon`), scanning `app/`, `bootstrap/app.php`, `config/`, `database/`, `routes/`.
- `composer test` — clears config cache, then runs lint:check, types:check, and `php artisan test`. This is what CI-equivalent checks run locally.
- `composer ci:check` — the fuller CI gate: JS lint:check, JS format:check, JS types:check, then `@test`.
- Single test: `php artisan test --compact --filter=testName`.
- `php artisan migrate --seed` (or `migrate:fresh --seed` to reset) — the seeders drive the app's own
  Action classes (confirm/check-in/check-out, invoice generation, payment confirmation, maintenance
  assignment) rather than inserting rows directly, so demo data is internally consistent. Demo accounts
  (all password `password`): `admin@example.com`, `receptionist@example.com`, `housekeeping@example.com`,
  `guest@example.com`.
- `php artisan storage:link` — needed once for room images to be served.

### JS / Frontend
- `npm run dev` — Vite dev server only (use `composer dev` instead if you also need the PHP server + queue worker).
- `npm run build` / `npm run build:ssr` — production build (SSR build also compiles a server bundle).
- `npm run lint` / `npm run lint:check` — ESLint (fix / check-only).
- `npm run format` / `npm run format:check` — Prettier over `resources/`.
- `npm run types:check` — `tsc --noEmit`.

Frontend routes/controllers are consumed via generated Wayfinder TypeScript in `resources/js/actions/` and
`resources/js/routes/` — these are **generated files** (by the `@laravel/vite-plugin-wayfinder` Vite plugin and
`php artisan wayfinder:generate`), do not hand-edit them; regenerate instead when backend routes/controllers change.

## Architecture

**Stack:** Laravel 13 (PHP 8.3) + Inertia.js v3 + React 19, using Fortify as a headless auth backend, Wayfinder for
typed frontend route/action bindings, Tailwind v4, and shadcn/Radix-based UI primitives.

### Routing & roles
- `routes/web.php` — public room browsing (`/`, `rooms/{room}`), a generic `auth`-only group
  (role-agnostic: dashboard, notifications, maintenance report/submit — any authenticated user can hit
  these), and a `role:guest` group (guest's own reservations/invoices/payments).
- `routes/staff.php` — two separate `role:` groups under the `staff.` name prefix: one for
  `receptionist,admin` (reservations, reservation services, payments), one for `housekeeping,admin`
  (housekeeping board, maintenance list/assign/status).
- `routes/admin.php` — `role:admin` only (dashboard, room/service/staff-account CRUD resources, invoices,
  settings).
- `routes/settings.php` — shared account settings (profile, security), required from `web.php`.
- **Roles are a plain `users.role` enum** (`admin`, `receptionist`, `housekeeping`, `guest`), *not*
  Spatie permissions — enforced by `App\Http\Middleware\EnsureUserHasRole` (registered as the `role:`
  middleware alias, e.g. `role:receptionist,admin`). Follow this existing convention; don't introduce a
  permissions package.
- A user's dashboard content differs by role from the *same* `dashboard` route
  (`App\Http\Controllers\DashboardController::index`) via a `match ($user->role)` branch — admins get
  redirected to `admin.dashboard.index` instead.

### Domain layer — Actions
Business logic lives in `app/Actions/{Domain}/` (`Reservations/`, `Invoices/`, `Payments/`, `Maintenance/`,
`Housekeeping/`, `Notifications/`, `Staff/`) — one class per operation, each with a single `handle()`
method, invoked from thin controllers. Multi-step operations wrap in `DB::transaction()`. Notably, the
**demo seeders drive these same Action classes** (`database/seeders/RealisticReservationSeeder.php`) rather
than inserting rows directly, so seeded data goes through the same status transitions/side effects as real
usage.

Validation rules that are shared between a "store" and "update" Form Request (or between a guest-facing and
staff-facing request for the same resource) live in `app/Concerns/*ValidationRules` traits — check for an
existing trait before duplicating a `rules()` array.

### Key state machines
- **Reservation** (`status`): `pending` → `confirmed` → `checked_in` → `checked_out` (short-stay), or
  `pending` → `active` → `expired` (long-stay), with `cancelled`/`terminated` as exits. Each transition is
  its own Action (`ConfirmReservation`, `CheckInReservation`, `CheckOutReservation`, `CancelReservation`)
  and pushes the related **Room** to a matching status.
- **Room** (`status`): `available` ↔ `reserved`/`occupied` (driven by reservation transitions) →
  `cleaning` (on checkout) → `available` (via `Housekeeping\MarkRoomCleaned`), or → `maintenance` (a
  resolved maintenance request on that room returns it to `available`).
- Availability checks (`Room::scopeAvailableBetween`, `Actions/Reservations/ReservationAvailability`) treat
  short-stay (`check_in_date`/`check_out_date`) and long-stay (`start_date`/`end_date`, open-ended if null)
  reservations differently — don't assume one date-pair shape fits both `reservation_type`s.

### Models & conventions
- Models: `User` (has `role`), `Room`, `RoomImage`, `Reservation`, `ReservationService` (pivot, with
  `quantity`/`unit_price` snapshotted at attach time), `Service`, `Invoice`, `Payment`,
  `MaintenanceRequest`, `Notification`, `Setting`.
- **Primary keys are UUIDs** (`HasUuids`), not auto-increment or ULIDs.
- **Fillable attributes use the PHP 8 `#[Fillable([...])]` attribute**, not a `protected $fillable = []`
  property — match this style on new models.
- Money columns are `decimal:2` casts; cast to `(float)` when shaping API/Resource output.
- `App\Http\Resources\*Resource` classes shape data returned to Inertia pages — reuse an existing one
  before hand-rolling an array shape for the same model.

### Frontend (`resources/js/`)
- `pages/` — Inertia page components, mirroring the controller/route structure 1:1 with
  `Inertia::render('path/name')` calls (e.g. `staff/reservations/index.tsx`, `admin/rooms/index.tsx`,
  `rooms/show.tsx` for the public room detail page).
- `layouts/` — composable layouts: `app/` (sidebar/header shell for authenticated pages, role-aware nav via
  `components/app-sidebar.tsx`), `auth/` (card/simple/split variants for auth pages), `settings/layout.tsx`.
- `components/ui/` — shadcn-style Radix primitives (button, dialog, dropdown, select, table, etc.); reuse
  these before adding new UI primitives. `components/` (non-`ui/`) holds app-specific composed components,
  several of which are domain dialogs reused across pages (e.g. `maintenance-request-dialog.tsx` is used
  from both the guest maintenance page and the staff housekeeping/maintenance pages).
- `actions/` and `routes/` — Wayfinder-generated typed wrappers around controllers/routes; import from
  `@/actions/...` or `@/routes/...` rather than hardcoding URLs.
- `hooks/`, `lib/`, `types/` — shared React hooks, utilities (e.g. `cn()` class merger), and TS types. Page
  prop types should be kept in sync with what each controller actually sends.

### i18n (English/Khmer)
- Dictionaries live in `resources/js/lib/i18n/{en,km}/*.ts`, one file per domain (`staff.ts`,
  `adminRooms.ts`, `reservations.ts`, `toasts.ts`, etc.), aggregated by `en/index.ts` / `km/index.ts`. The
  `Dictionary` type (`lib/i18n/translate.ts`) is inferred as `typeof en`, so the `km` files are type-checked
  against whatever keys `en` defines — add a key to `en` first, then mirror it in `km` (never leave a `km`
  file out of sync, or `tsc` will fail).
- `useTranslation()` (`hooks/use-translation.tsx`) exposes `t(key, params?)`; keys are dot-paths
  (`'staff.reservations.pageTitle'`) and support `{{param}}` interpolation. Never hardcode user-facing
  English/Khmer strings in a component.
- **Toast flash messages carry an i18n key, not translated text.** Controllers flash
  `Inertia::flash('toast', ['type' => 'success', 'key' => 'toasts.domain.action'])`; the frontend resolves
  the key via `hooks/use-flash-toast.ts` against `lib/i18n/*/toasts.ts`. Backend validation error messages
  are similarly re-mapped client-side by `lib/i18n/validation-translator.ts` rather than trusting raw
  Laravel validation strings.

### Shared Inertia props
`HandleInertiaRequests` (`app/Http/Middleware/`) shares `auth.user`, `flash` (including the `toast` key
above and a one-off `checkoutInvoice` payload flashed after a reservation checkout), `sidebarOpen`
(persisted via a cookie), and `unreadNotificationsCount` on every request. `HandleAppearance` persists the
light/dark/system appearance cookie/prop separately.

### Auth (Fortify)
Fortify is fully headless: `app/Providers/FortifyServiceProvider.php` wires custom actions
(`app/Actions/Fortify/CreateNewUser.php`, `ResetUserPassword.php`) and overrides every Fortify view to
return `Inertia::render()` calls into `resources/js/pages/auth/*` instead of Blade. Fortify also defines
rate limiters here for `login`, `two-factor`, and `passkeys`. Passkey (WebAuthn) support is provided by
`@laravel/passkeys` + `resources/js/components/{manage-passkeys,passkey-item,passkey-register,passkey-verify}.tsx`
and a `.well-known/passkey-endpoints` route.

### Testing
- Pest is the test framework (`tests/Feature`, `tests/Unit`); in-memory SQLite is used for the `testing`
  environment (`phpunit.xml`), with `QUEUE_CONNECTION=sync`, `CACHE_STORE=array`, `SESSION_DRIVER=array`.
- Feature tests are organized by role/domain (`tests/Feature/Auth/`, `Settings/`, `Staff/`, `Admin/`, plus
  top-level domain tests like `ReservationTest.php`, `DashboardTest.php`) — put a new test alongside its
  closest existing sibling rather than inventing a new grouping.

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application running on PHP 8.3. You are an expert with the Laravel ecosystem. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists (settled decisions, non-obvious traps, standing constraints). Framework and package guidelines that only apply to specific paths (testing, frontend, components) also live there, under `.ai/rules/boost` — this is not just recorded decisions, it is load-bearing guidance you have not seen inline. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.
- Record durable rules with `record-rule` so the next agent or teammate inherits them instead of working them out again. Pass a `glob` (e.g. `app/Http/Controllers/**`), a short `title`, and a few-line `note`. Always use `record-rule`, never your native memory or notes tool — native memory is personal and session-scoped; only `.ai/rules` is shared with the team and persists in the repo.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
