# ដ្យាក្រាមទំនាក់ទំនងទិន្នន័យ (ERD) — Sonita Guest House

សរសេរជា **DBML** ដើម្បីអាចចម្លងផ្តិតទៅបិទភ្ជាប់នៅ [dbdiagram.io](https://dbdiagram.io) ដោយផ្ទាល់
សម្រាប់មើលជាដ្យាក្រាមមើលឃើញ។ បង្កើតឡើងផ្ទាល់ពី Laravel migrations ជាក់ស្តែងក្នុង
`database/migrations/` (មិនមែនគូរដោយដៃទេ) ដូច្នេះតែងតែផ្គូផ្គងនឹងអ្វីដែលមាននៅក្នុងមូលដ្ឋានទិន្នន័យ
ជាក់ស្តែង។ គ្របដណ្តប់លើតារាងសំខាន់ចំនួន **១៥** តារាង; តារាងហេដ្ឋារចនាសម្ព័ន្ធរបស់ Laravel/Fortify
(`sessions`, `cache`, `jobs`, `password_reset_tokens`, `passkeys`) មិនបានរាប់បញ្ចូលទេ ព្រោះមិនមែន
ជាទិន្នន័យស្នូលរបស់កម្មវិធី។

> [!NOTE]
> ឈ្មោះតារាង ឈ្មោះជួរឈរ និងប្រភេទទិន្នន័យនៅតែសរសេរជាភាសាអង់គ្លេស (ជាទម្រង់បច្ចេកទេស DBML
> ដែលត្រូវការឲ្យត្រឹមត្រូវទើបដ្យាក្រាមអាចដំណើរការបាននៅ dbdiagram.io)។ ចំណែកឯចំណារពន្យល់ (notes)
> ត្រូវបានបកប្រែជាភាសាខ្មែរ ដើម្បីបង្ហាញនៅលើដ្យាក្រាមផ្ទាល់ (លេចឡើងជា tooltip ពេលចង្អុលលើវាល)។

## ដ្យាក្រាម (ចម្លងប្លុកនេះទៅបិទភ្ជាប់នៅ dbdiagram.io)

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
  remember_token varchar
  created_at timestamp
  updated_at timestamp

  Note: 'អ្នកប្រើប្រាស់ម្នាក់ៗមានតួនាទីតែមួយប៉ុណ្ណោះ'
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
  check_in_date date [note: 'សម្រាប់ស្នាក់នៅរយៈពេលខ្លីតែប៉ុណ្ណោះ']
  check_out_date date [note: 'សម្រាប់ស្នាក់នៅរយៈពេលខ្លីតែប៉ុណ្ណោះ']
  start_date date [note: 'សម្រាប់ស្នាក់នៅរយៈពេលវែងតែប៉ុណ្ណោះ']
  end_date date [note: 'សម្រាប់ស្នាក់នៅរយៈពេលវែង អាចទុកទទេបាន (មិនកំណត់ថ្ងៃចេញ)']
  deposit_amount decimal
  monthly_due_day int [note: 'សម្រាប់ស្នាក់នៅរយៈពេលវែងតែប៉ុណ្ណោះ']
  num_guests int
  status reservation_status
  promo_code varchar [note: 'អាចទុកទទេបាន កត់ត្រាទុកនៅពេលកក់']
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
  unit_price decimal [note: 'តម្លៃដែលកត់ត្រាទុកនៅពេលភ្ជាប់']
  created_at timestamp
  updated_at timestamp

  Note: 'តារាងភ្ជាប់រវាង reservations និង services (many-to-many)'
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
  discount_amount decimal [default: 0, note: 'ចំនួនបញ្ចុះតម្លៃពីកូដ អនុវត្តមុនគិតពន្ធ']
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
  proof_image varchar [note: 'អាចទុកទទេបាន']
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
  assigned_to uuid [ref: > users.id, note: 'អាចទុកទទេបាន — បុគ្គលិកសម្អាត']
  resolved_at timestamp
  created_at timestamp
  updated_at timestamp
}

Table notifications {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  type varchar
  message text
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

  Note: 'តារាងតែមួយជួរ — ប្រព័ន្ធរំពឹងថាមានតែមួយកំណត់ត្រា'
}

Table reviews {
  id uuid [pk]
  reservation_id uuid [ref: - reservations.id, note: 'តែមួយគត់ — មួយការវាយតម្លៃក្នុងមួយការស្នាក់នៅ']
  guest_id uuid [ref: > users.id]
  rating int [note: 'ពី១ដល់៥ផ្កាយ']
  comment text [note: 'អាចទុកទទេបាន']
  created_at timestamp
  updated_at timestamp

  Note: 'សរសេរបានតែពេលការកក់ស្នាក់នៅរយៈពេលខ្លីមួយបានចេញ (checked_out) រួចហើយ'
}

Table waitlist_entries {
  id uuid [pk]
  email varchar
  phone_number varchar [note: 'អាចទុកទទេបាន']
  stay_type stay_type
  from_date date [note: 'អាចទុកទទេបាន']
  to_date date [note: 'អាចទុកទទេបាន']
  notified_at timestamp [note: 'អាចទុកទទេបាន កត់ត្រានៅពេល Admin ផ្ញើអ៊ីមែលជូនដំណឹង']
  created_at timestamp
  updated_at timestamp

  Note: 'គ្មានទំនាក់ទំនងទៅ users ទេ — កត់ត្រាភ្ញៀវទូទៅ មិនចាំបាច់ជាសមាជិកចុះឈ្មោះទេ'
}

Table activity_logs {
  id uuid [pk]
  causer_id uuid [ref: > users.id, note: 'អាចទុកទទេបាន']
  action varchar [note: 'ឧទាហរណ៍ room.created, reservation.checked_in']
  subject_type varchar
  subject_id uuid [note: 'ភ្ជាប់ជាមួយ subject_type គ្មានទំនាក់ទំនងផ្ទាល់']
  description varchar
  properties json [note: 'អាចទុកទទេបាន']
  created_at timestamp [note: 'គ្មាន updated_at ទេ — កំណត់ត្រាសរសេរតែម្តងគត់']

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
  expires_at date [note: 'អាចទុកទទេបាន']
  max_uses int [note: 'អាចទុកទទេបាន — ប្រើគ្មានកំណត់បើទុកទទេ']
  used_count int [default: 0]
  created_at timestamp
  updated_at timestamp

  Note: 'គ្មានទំនាក់ទំនងផ្ទាល់ពី reservations — reservations.promo_code រក្សាទុកជាអក្សរ ហើយត្រូវបានស្វែងរកនៅពេលចេញវិក្កយបត្រ'
}
```

## ចំណារពន្យល់

- **Primary key ទាំងអស់ជា UUID** (`HasUuids`) មិនមែនជាលេខរៀងឡើងបន្តបន្ទាប់ (auto-increment) ទេ —
  ជាការសម្រេចចិត្តដោយចេតនា ដើម្បីការពារការទាយលេខ ID (enumeration attack) លើកំណត់ត្រាដែលបង្ហាញ
  ជាសាធារណៈ។
- `reservation_service` ជាតារាងភ្ជាប់ពិតប្រាកដ (មាន `id` ផ្ទាល់ខ្លួន បូកនឹង `quantity` និង `unit_price`
  ដែលកត់ត្រាតម្លៃទុកនៅពេលភ្ជាប់) សម្រាប់ដោះស្រាយទំនាក់ទំនង many-to-many រវាង `reservations` និង
  `services` — មិនមែនគ្រាន់តែជា pivot ធម្មតាទេ។
- `maintenance_requests` មានទំនាក់ទំនងទៅ `users` **ពីរ** — `reporter_id` (អ្នករាយការណ៍) និង
  `assigned_to` (បុគ្គលិកសម្អាតដែលត្រូវបានចាត់តាំង អាចទុកទទេបានរហូតទាល់តែ Admin ចាត់តាំង)។
- `settings` ជាតារាងតែមួយជួរ (ប្រព័ន្ធរំពឹងថាមានតែមួយកំណត់ត្រា) និងគ្មានទំនាក់ទំនង FK ទេ — ផ្ទុក
  ការកំណត់អាជីវកម្មទូទៅ (រូបិយប័ណ្ណ អត្រាពន្ធ អត្រាគិតលុយសេវាកម្ម ។ល។) មិនមែនទិន្នន័យក្នុងមួយកំណត់ត្រា
  ដាច់ដោយឡែកទេ។
- `reviews.reservation_id` មានលក្ខខណ្ឌ **unique** — មួយការវាយតម្លៃក្នុងមួយការស្នាក់នៅតែប៉ុណ្ណោះ
  ត្រូវបានអនុវត្តនៅកម្រិតមូលដ្ឋានទិន្នន័យផ្ទាល់ (មិនមែនត្រឹមតែពិនិត្យនៅកម្រិតកម្មវិធីទេ) ហើយសរសេរបានតែ
  ពេលការកក់ស្នាក់នៅរយៈពេលខ្លីមួយបានចេញ (`checked_out`) រួចហើយ។
- `waitlist_entries` គ្មានទំនាក់ទំនង FK ទៅ `users` ទេ — គ្រាន់តែជាអ៊ីមែល/លេខទូរស័ព្ទដែលកត់ត្រាទុកពី
  អ្នកចូលមើលទូទៅ ដែលកំពុងស្វែងរកបន្ទប់ក្នុងចន្លោះកាលបរិច្ឆេទដែលពេញរួច មិនចាំបាច់ជាភ្ញៀវដែលបានចុះឈ្មោះទេ។
- `activity_logs` ប្រើគូ `subject_type` + `subject_id` (ស្រដៀងនឹងទំនាក់ទំនង polymorphic) ជំនួសឲ្យ FK
  ព្រោះតារាងកំណត់ត្រាសកម្មភាពមួយនេះ កត់ត្រាព្រឹត្តិការណ៍ចេញពី Model ជាច្រើនប្រភេទផ្សេងគ្នា (បន្ទប់
  ការកក់ គណនីបុគ្គលិក ការទូទាត់ ការកំណត់) មិនមែនទំនាក់ទំនងតែមួយប្រភេទទេ។ `causer_id` អាចទុកទទេបាន
  និងកំណត់ជា `nullOnDelete` ដើម្បីឲ្យកំណត់ត្រានៅតែមាននៅ ទោះបីគណនីបុគ្គលិកនោះត្រូវបានលុបនៅពេលក្រោយ
  ក៏ដោយ។ វាគ្មាន `updated_at` ទេ ព្រោះកំណត់ត្រាសកម្មភាពសរសេរតែម្តងគត់ មិនកែប្រែវិញទេ។
- `promo_codes` ក៏គ្មានទំនាក់ទំនង FK ដែរ — ការកក់មួយគ្រាន់តែរក្សាទុកអក្សរកូដ (`reservations.promo_code`)
  ដែលត្រូវបានស្វែងរកផ្ទៀងផ្ទាត់ជាមួយ `promo_codes.code` នៅពេលចេញវិក្កយបត្រ ដូច្នេះកូដមួយអាចត្រូវបាន
  កែប្រែ ឬលុបនៅពេលក្រោយ ដោយមិនប៉ះពាល់ដល់ការកក់ចាស់ៗទេ។
- `id_card_image` នៅលើ `users` និង `email_verified_at`/`password`/`remember_token` មាននៅក្នុងតារាង
  ជាក់ស្តែង (មើល `database/migrations/0001_01_01_000000_create_users_table.php`) ហើយបានរាប់
  បញ្ចូលខាងលើដើម្បីភាពពេញលេញ។
