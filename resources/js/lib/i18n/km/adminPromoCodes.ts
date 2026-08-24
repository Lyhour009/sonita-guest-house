import type { adminPromoCodes as adminPromoCodesEn } from '../en/adminPromoCodes';

export const adminPromoCodes: typeof adminPromoCodesEn = {
    title: 'កូដបញ្ចុះតម្លៃ',
    subtitle: 'កូដបញ្ចុះតម្លៃដែលភ្ញៀវ និងបុគ្គលិកអាចប្រើនៅពេលកក់បន្ទប់។',
    searchPlaceholder: 'ស្វែងរកតាមកូដ...',
    addPromoCode: 'បន្ថែមកូដបញ្ចុះតម្លៃ',
    createPromoCode: 'បង្កើតកូដបញ្ចុះតម្លៃ',
    editPromoCode: 'កែប្រែ {{code}}',
    active: 'សកម្ម',
    inactive: 'អសកម្ម',
    noExpiry: 'គ្មានកាលកំណត់',
    table: {
        code: 'កូដ',
        discount: 'បញ្ចុះតម្លៃ',
        usage: 'ការប្រើប្រាស់',
        expires: 'ផុតកំណត់',
        status: 'ស្ថានភាព',
    },
    form: {
        code: 'កូដ',
        discountType: 'ប្រភេទបញ្ចុះតម្លៃ',
        percent: 'ភាគរយ',
        fixed: 'ចំនួនថេរ',
        discountValuePercent: 'បញ្ចុះតម្លៃ (%)',
        discountValueFixed: 'បញ្ចុះតម្លៃ ($)',
        expiresAt: 'ផុតកំណត់នៅ (ស្រេចចិត្ត)',
        maxUses: 'ចំនួនប្រើប្រាស់អតិបរមា (ស្រេចចិត្ត)',
        unlimited: 'មិនកំណត់',
        active: 'សកម្ម',
    },
    deletePromoCode: {
        title: 'លុប {{code}}?',
        description:
            'នេះមិនអាចត្រឡប់វិញបានទេ។ វិក្កយបត្រដែលបានប្រើកូដនេះរួចហើយនឹងរក្សាទុកការបញ្ចុះតម្លៃដែលបានកត់ត្រា។',
    },
    empty: 'មិនទាន់មានកូដបញ្ចុះតម្លៃនៅឡើយទេ។',
    emptyDescription: 'បង្កើតមួយ ដើម្បីឱ្យភ្ញៀវ និងបុគ្គលិកអាចប្រើនៅពេលកក់។',
    showingCount: 'បង្ហាញ {{shown}} នៃ {{total}} កូដបញ្ចុះតម្លៃ',
};
