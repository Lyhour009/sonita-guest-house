import type { Dictionary } from '../translate';

export const nav: Dictionary['nav'] = {
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    groups: {
        reservations: 'ការកក់',
        staff: 'បុគ្គលិក',
        housekeeping: 'សម្អាតបន្ទប់',
        admin: 'អ្នកគ្រប់គ្រង',
        operations: 'ប្រតិបត្តិការ',
        finance: 'ហិរញ្ញវត្ថុ',
        maintenance: 'ការថែទាំ',
        management: 'ការគ្រប់គ្រង',
    },
    guest: {
        myReservations: 'ការកក់របស់ខ្ញុំ',
        myInvoices: 'វិក្កយបត្ររបស់ខ្ញុំ',
        myPayments: 'ការទូទាត់របស់ខ្ញុំ',
        maintenance: 'ជួសជុល',
    },
    staff: {
        reservations: 'ការកក់',
        payments: 'ការទូទាត់',
        roomStatus: 'ស្ថានភាពបន្ទប់',
        maintenance: 'ជួសជុល',
    },
    admin: {
        rooms: 'បន្ទប់',
        invoices: 'វិក្កយបត្រ',
        services: 'សេវាកម្ម',
        staffAccounts: 'គណនីបុគ្គលិក',
        settings: 'ការកំណត់',
    },
    login: 'ចូលគណនី',
    logout: 'ចាកចេញ',
    register: 'ចុះឈ្មោះ',
    logInToBook: 'ចូលគណនីដើម្បីកក់',
};
