import type { adminWaitlist as adminWaitlistEn } from '../en/adminWaitlist';

export const adminWaitlist: typeof adminWaitlistEn = {
    title: 'បញ្ជីរង់ចាំ',
    subtitle: 'ភ្ញៀវដែលកំពុងរង់ចាំបន្ទប់ទំនេរសម្រាប់កាលបរិច្ឆេទដែលពេញ។',
    searchPlaceholder: 'ស្វែងរកតាមអ៊ីមែល ឬលេខទូរស័ព្ទ...',
    table: {
        contact: 'ទំនាក់ទំនង',
        stayType: 'ប្រភេទស្នាក់នៅ',
        dates: 'កាលបរិច្ឆេទ',
        requested: 'បានស្នើសុំ',
        status: 'ស្ថានភាព',
    },
    status: {
        pending: 'កំពុងរង់ចាំ',
        notified: 'បានជូនដំណឹង',
    },
    notify: 'ជូនដំណឹង',
    empty: 'មិនមានអ្នកណាក្នុងបញ្ជីរង់ចាំនាពេលនេះទេ។',
    emptyDescription:
        'ធាតុនឹងបង្ហាញនៅទីនេះនៅពេលភ្ញៀវស្នើសុំការជូនដំណឹងអំពីការស្វែងរកដែលពេញ។',
    showingCount: 'បង្ហាញ {{shown}} នៃ {{total}} ធាតុ',
    openEnded: 'មិនកំណត់ថ្ងៃបញ្ចប់',
};
