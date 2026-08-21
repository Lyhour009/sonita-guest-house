import type { toasts as toastsEn } from '../en/toasts';

export const toasts: typeof toastsEn = {
    rooms: {
        created: 'បន្ទប់ត្រូវបានបង្កើត។',
        updated: 'បន្ទប់ត្រូវបានកែប្រែ។',
        deleted: 'បន្ទប់ត្រូវបានលុប។',
        imagesUploaded: 'រូបភាពត្រូវបានបញ្ចូល។',
        imageRemoved: 'រូបភាពត្រូវបានលុប។',
    },
    services: {
        created: 'សេវាកម្មត្រូវបានបង្កើត។',
        updated: 'សេវាកម្មត្រូវបានកែប្រែ។',
        deleted: 'សេវាកម្មត្រូវបានលុប។',
    },
    settings: {
        updated: 'ការកំណត់ត្រូវបានកែប្រែ។',
    },
    staffAccounts: {
        created: 'គណនីបុគ្គលិកត្រូវបានបង្កើត។',
        updated: 'គណនីបុគ្គលិកត្រូវបានកែប្រែ។',
    },
    invoices: {
        generated: 'វិក្កយបត្រត្រូវបានបង្កើត។',
    },
    maintenance: {
        submitted: 'សំណើជួសជុលត្រូវបានដាក់ស្នើ។',
        assigned: 'សំណើជួសជុលត្រូវបានចាត់តាំង។',
        updated: 'សំណើជួសជុលត្រូវបានកែប្រែ។',
    },
    payments: {
        submitted: 'ការទូទាត់ត្រូវបានដាក់ស្នើ — កំពុងរង់ចាំការបញ្ជាក់។',
        confirmed: 'ការទូទាត់ត្រូវបានបញ្ជាក់។',
        rejected: 'ការទូទាត់ត្រូវបានបដិសេធ។',
    },
    reservations: {
        requested: 'ការកក់ត្រូវបានស្នើសុំ — កំពុងរង់ចាំការបញ្ជាក់។',
        cancelled: 'ការកក់ត្រូវបានបោះបង់។',
        createdByStaff: 'ការកក់ត្រូវបានបង្កើតដោយជោគជ័យ។',
        confirmed: 'ការកក់ត្រូវបានបញ្ជាក់។',
        checkedIn: 'ការចូលស្នាក់នៅត្រូវបានបញ្ចប់ដោយជោគជ័យ។',
        checkedOut: 'ការចេញស្នាក់នៅត្រូវបានបញ្ចប់ដោយជោគជ័យ។',
    },
    profile: {
        updated: 'ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានកែប្រែ។',
    },
    security: {
        passwordUpdated: 'ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរ។',
    },
    housekeeping: {
        roomCleaned: 'បន្ទប់ត្រូវបានសម្គាល់ថាស្អាត។',
    },
};
