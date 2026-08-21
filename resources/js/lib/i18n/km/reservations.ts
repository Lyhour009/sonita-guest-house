import type { reservations as reservationsEn } from '../en/reservations';

export const reservations: typeof reservationsEn = {
    page: {
        title: 'ការកក់របស់ខ្ញុំ',
        empty: 'អ្នកមិនទាន់មានការកក់នៅឡើយទេ។',
    },
    table: {
        dates: 'កាលបរិច្ឆេទ',
    },
    dateRange: {
        openEnded: 'មិនកំណត់ថ្ងៃបញ្ចប់',
    },
    cancelDialog: {
        title: 'បោះបង់ការកក់នេះ?',
        description: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
        keepIt: 'រក្សាទុកការកក់',
        confirm: 'បោះបង់ការកក់',
    },
    bookDialog: {
        trigger: 'កក់បន្ទប់នេះ',
        title: 'កក់បន្ទប់ {{roomNumber}}',
        checkIn: 'ថ្ងៃចូល',
        checkOut: 'ថ្ងៃចេញ',
        guests: 'ចំនួនភ្ញៀវ',
        moveInDate: 'ថ្ងៃចូលនៅ',
        moveOutDateOptional: 'ថ្ងៃចេញនៅ (ស្រេចចិត្ត)',
        submit: 'ស្នើសុំកក់បន្ទប់',
    },
};
