import type { reservations as reservationsEn } from '../en/reservations';

export const reservations: typeof reservationsEn = {
    page: {
        title: 'ការកក់របស់ខ្ញុំ',
        subtitle: 'ការស្នាក់នៅកន្លងមក និងខាងមុខរបស់អ្នកនៅ Sonita Guest House។',
        empty: 'អ្នកមិនទាន់មានការកក់នៅឡើយទេ។',
        emptyDescription: 'កក់បន្ទប់ដើម្បីមើលការកក់របស់អ្នកនៅទីនេះ។',
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
        promoCodeLabel: 'កូដបញ្ចុះតម្លៃ (ស្រេចចិត្ត)',
        promoCodePlaceholder: 'SAVE10',
        submit: 'ស្នើសុំកក់បន្ទប់',
    },
};
