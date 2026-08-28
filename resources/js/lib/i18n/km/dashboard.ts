import type { dashboard as dashboardEn } from '../en/dashboard';

export const dashboard: typeof dashboardEn = {
    guest: {
        title: 'ផ្ទាំងគ្រប់គ្រងរបស់ខ្ញុំ',
        currentReservations: 'ការកក់បច្ចុប្បន្ន',
        noActiveReservations: 'អ្នកមិនមានការកក់សកម្មទេ។',
        latestInvoice: 'វិក្កយបត្រចុងក្រោយ',
        noInvoices: 'អ្នកមិនទាន់មានវិក្កយបត្រនៅឡើយទេ។',
        recentNotifications: 'ការជូនដំណឹងថ្មីៗ',
        noNotifications: 'អ្នកមិនទាន់មានការជូនដំណឹងនៅឡើយទេ។',
        reviewableTitle: 'តើការស្នាក់នៅរបស់អ្នកយ៉ាងណាដែរ?',
        leaveReview: 'ផ្តល់មតិវាយតម្លៃ',
        reviewDialog: {
            title: 'វាយតម្លៃបន្ទប់ {{room}}',
            ratingLabel: 'ការវាយតម្លៃរបស់អ្នក',
            commentLabel: 'មតិយោបល់ (ស្រេចចិត្ត)',
            commentPlaceholder: 'ប្រាប់យើងអំពីការស្នាក់នៅរបស់អ្នក...',
            submit: 'ដាក់ស្នើការវាយតម្លៃ',
        },
    },
    receptionist: {
        title: 'ផ្ទាំងគ្រប់គ្រងផ្នែកទទួលភ្ញៀវ',
        subtitle: 'ភ្ញៀវមកដល់ ភ្ញៀវចេញថ្ងៃនេះ និងស្ថានភាពបន្ទប់ជាបន្តបន្ទាប់។',
        todaysArrivals: 'ភ្ញៀវមកដល់ថ្ងៃនេះ ({{count}})',
        noArrivals: 'មិនមានភ្ញៀវមកដល់ថ្ងៃនេះទេ។',
        todaysDepartures: 'ភ្ញៀវចេញថ្ងៃនេះ ({{count}})',
        noDepartures: 'មិនមានភ្ញៀវចេញថ្ងៃនេះទេ។',
        noRooms: 'មិនទាន់មានបន្ទប់ត្រូវបានបញ្ចូលនៅឡើយទេ។',
        statArrivals: 'មកដល់ថ្ងៃនេះ',
        statDepartures: 'ចេញថ្ងៃនេះ',
        statAvailable: 'ទំនេរឥឡូវនេះ',
        statNeedsAttention: 'កំពុងសម្អាត / ជួសជុល',
        roomOverviewTitle: 'ស្ថានភាពបន្ទប់',
        roomOverviewSubtitle:
            'ស្ថានភាពជាបន្តបន្ទាប់នៃបន្ទប់ទាំងអស់ក្នុងផ្ទះសំណាក់។',
        allRoomsFilter: 'បន្ទប់ទាំងអស់',
        noRoomsMatch: 'គ្មានបន្ទប់ត្រូវនឹងតម្រងនេះទេ។',
    },
    housekeeping: {
        title: 'ផ្ទាំងគ្រប់គ្រងផ្នែកសម្អាត',
        roomsAwaitingCleaning: 'បន្ទប់រង់ចាំសម្អាត',
        openAssignedMaintenance: 'ការជួសជុលដែលបានចាត់តាំង',
    },
};
