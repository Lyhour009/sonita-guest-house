import type { Locale } from '@/hooks/use-locale';

const khmerAttributeNames: Record<string, string> = {
    'room id': 'បន្ទប់',
    room_id: 'បន្ទប់',
    'guest id': 'ភ្ញៀវ',
    guest_id: 'ភ្ញៀវ',
    'check in date': 'ថ្ងៃចូលស្នាក់នៅ',
    check_in_date: 'ថ្ងៃចូលស្នាក់នៅ',
    'check out date': 'ថ្ងៃចេញស្នាក់នៅ',
    check_out_date: 'ថ្ងៃចេញស្នាក់នៅ',
    'start date': 'ថ្ងៃចូលស្នាក់នៅ',
    start_date: 'ថ្ងៃចូលស្នាក់នៅ',
    'end date': 'ថ្ងៃចេញស្នាក់នៅ',
    end_date: 'ថ្ងៃចេញស្នាក់នៅ',
    'num guests': 'ចំនួនភ្ញៀវ',
    num_guests: 'ចំនួនភ្ញៀវ',
    'reservation type': 'ប្រភេទស្នាក់នៅ',
    reservation_type: 'ប្រភេទស្នាក់នៅ',
    'new guest': 'ភ្ញៀវថ្មី',
    new_guest: 'ភ្ញៀវថ្មី',
    'new guest.full name': 'ឈ្មោះពេញ',
    'new_guest.full_name': 'ឈ្មោះពេញ',
    'new guest.email': 'អ៊ីមែល',
    'new_guest.email': 'អ៊ីមែល',
    'full name': 'ឈ្មោះពេញ',
    full_name: 'ឈ្មោះពេញ',
    email: 'អ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    'phone number': 'លេខទូរស័ព្ទ',
    phone_number: 'លេខទូរស័ព្ទ',
    amount: 'ចំនួនទឹកប្រាក់',
    'room number': 'លេខបន្ទប់',
    room_number: 'លេខបន្ទប់',
    'room type': 'ប្រភេទបន្ទប់',
    room_type: 'ប្រភេទបន្ទប់',
    'price per night': 'តម្លៃក្នុងមួយយប់',
    price_per_night: 'តម្លៃក្នុងមួយយប់',
    'price per month': 'តម្លៃក្នុងមួយខែ',
    price_per_month: 'តម្លៃក្នុងមួយខែ',
    title: 'ចំណងជើង',
    description: 'ការពិពណ៌នា',
};

function getKhmerField(field: string): string {
    const normalized = field.toLowerCase().trim();

    return khmerAttributeNames[normalized] || normalized.replace(/_/g, ' ');
}

export function translateValidationError(
    message: string,
    locale: Locale,
): string {
    if (locale !== 'km' || !message) {
        return message;
    }

    const trimmed = message.trim();

    // 1. "The :field field is required when :other is :val."
    const reqWhenMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+is required when\s+(.+?)\s+is\s+(.+?)\.?$/i,
    );

    if (reqWhenMatch) {
        const field = getKhmerField(reqWhenMatch[1]);

        return `សូមជ្រើសរើស ឬបញ្ចូល ${field}។`;
    }

    // 2. "The :field field is required when :other is not present." / "is present"
    const reqWhenNotPresentMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+is required when\s+(.+?)\s+is( not)? present\.?$/i,
    );

    if (reqWhenNotPresentMatch) {
        const field = getKhmerField(reqWhenNotPresentMatch[1]);

        return `សូមជ្រើសរើស ឬបញ្ចូល ${field}។`;
    }

    // 3. "The :field field is required."
    const reqMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+is required\.?$/i,
    );

    if (reqMatch) {
        const field = getKhmerField(reqMatch[1]);

        return `សូមបញ្ចូល ឬជ្រើសរើស ${field}។`;
    }

    // 4. "The :field has already been taken."
    const takenMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+has already been taken\.?$/i,
    );

    if (takenMatch) {
        const field = getKhmerField(takenMatch[1]);

        return `${field} នេះត្រូវបានប្រើប្រាស់រួចហើយ។`;
    }

    // 5. "The :field must be a valid email address."
    const emailMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+must be a valid email address\.?$/i,
    );

    if (emailMatch) {
        const field = getKhmerField(emailMatch[1]);

        return `${field} មិនត្រឹមត្រូវតាមទម្រង់អ៊ីមែលទេ។`;
    }

    // 6. "The :field must be after :other." or "The :field field must be a date after :other."
    const afterMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+must be (?:a date )?after\s+([a-zA-Z0-9_\s.]+?)\.?$/i,
    );

    if (afterMatch) {
        const field = getKhmerField(afterMatch[1]);
        const other = getKhmerField(afterMatch[2]);

        return `${field} ត្រូវតែបន្ទាប់ពី ${other}។`;
    }

    // 7. "The :field must be after or equal to :other."
    const afterEqualMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+must be (?:a date )?after or equal to\s+(.+?)\.?$/i,
    );

    if (afterEqualMatch) {
        const field = getKhmerField(afterEqualMatch[1]);

        return `${field} ត្រូវតែចាប់ពីថ្ងៃនេះតទៅ។`;
    }

    // 8. "The :field must be an integer." / "The :field must be at least :min."
    const intMatch = trimmed.match(
        /^The\s+([a-zA-Z0-9_\s.]+?)(?:\s+field)?\s+must be (an integer|at least \d+)\.?$/i,
    );

    if (intMatch) {
        const field = getKhmerField(intMatch[1]);

        return `${field} ត្រូវតែជាចំនួនគត់យ៉ាងតិច ១ នាក់។`;
    }

    return message;
}
