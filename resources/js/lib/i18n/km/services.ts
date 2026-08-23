import type { Dictionary } from '../translate';

export const services: Dictionary['services'] = {
    title: 'សេវាកម្ម',
    subtitle: 'គ្រប់គ្រងសេវាកម្មបន្ថែម និងតាមដានភាពញឹកញាប់ដែលភ្ញៀវកក់ប្រើ។',
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះ...',
    usageFilter: {
        placeholder: 'ការប្រើប្រាស់',
        any: 'គ្រប់ការប្រើប្រាស់',
        used: 'បានប្រើ',
        unused: 'មិនទាន់ប្រើ',
    },
    stats: {
        total: 'សេវាកម្មសរុប',
        totalBookings: 'ការកក់សរុប',
        totalRevenue: 'ចំណូលសរុប',
        unused: 'មិនទាន់ប្រើ',
    },
    unused: 'មិនទាន់ប្រើ',
    cannotDeleteInUse: 'មិនអាចលុបបានទេ — សេវាកម្មនេះកំពុងប្រើនៅក្នុងការកក់',
    table: {
        name: 'ឈ្មោះ',
        price: 'តម្លៃ',
        bookings: 'ការកក់',
        revenue: 'ចំណូល',
    },
    empty: 'មិនទាន់មានសេវាកម្មនៅឡើយទេ។',
    emptyDescription: 'បន្ថែមសេវាកម្មមួយដើម្បីផ្តល់ជូននៅពេលភ្ញៀវកក់។',
    showingCount: 'កំពុងបង្ហាញ {{shown}} នៃ {{total}} សេវាកម្ម',
    addService: 'បន្ថែមសេវាកម្ម',
    createService: 'បង្កើតសេវាកម្ម',
    editService: 'កែសម្រួល {{name}}',
    deleteService: {
        title: 'លុប {{name}}?',
        description: 'មិនអាចត្រឡប់វិញបានទេ។',
    },
    form: {
        name: 'ឈ្មោះ',
        price: 'តម្លៃ ($)',
    },
};
