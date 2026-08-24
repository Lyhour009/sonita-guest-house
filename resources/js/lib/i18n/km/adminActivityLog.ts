import type { adminActivityLog as adminActivityLogEn } from '../en/adminActivityLog';

export const adminActivityLog: typeof adminActivityLogEn = {
    title: 'កំណត់ហេតុសកម្មភាព',
    subtitle: 'កំណត់ត្រាសកម្មភាពសំខាន់ៗរបស់អ្នកគ្រប់គ្រង និងបុគ្គលិក។',
    searchPlaceholder: 'ស្វែងរកការពិពណ៌នា...',
    actionFilter: {
        placeholder: 'សកម្មភាព',
        any: 'សកម្មភាពទាំងអស់',
    },
    table: {
        causer: 'ដោយ',
        action: 'សកម្មភាព',
        description: 'ការពិពណ៌នា',
        when: 'ពេលវេលា',
    },
    system: 'ប្រព័ន្ធ',
    empty: 'មិនទាន់មានសកម្មភាពត្រូវបានកត់ត្រានៅឡើយទេ។',
    emptyDescription:
        'សកម្មភាពសំខាន់ៗដូចជាការផ្លាស់ប្តូរបន្ទប់ បុគ្គលិក និងការកំណត់ នឹងបង្ហាញនៅទីនេះ។',
    showingCount: 'បង្ហាញ {{shown}} នៃ {{total}} ធាតុ',
};
