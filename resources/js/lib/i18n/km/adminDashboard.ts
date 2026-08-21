import type { Dictionary } from '../translate';

export const adminDashboard: Dictionary['adminDashboard'] = {
    title: 'ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង',
    stats: {
        revenueThisMonth: 'ចំណូលខែនេះ',
        outstandingInvoices: 'វិក្កយបត្រមិនទាន់បង់',
        openMaintenanceRequests: 'សំណើជួសជុលកំពុងរង់ចាំ',
        totalRooms: 'ចំនួនបន្ទប់សរុប',
    },
    revenueChart: {
        title: 'ចំណូល — ១៤ថ្ងៃចុងក្រោយ',
        legend: 'ចំណូល',
    },
    occupancyChart: {
        title: 'ស្ថានភាពកាន់កាប់បន្ទប់',
        shortStayLegend: 'ស្នាក់នៅរយៈពេលខ្លី (កំពុងប្រើ)',
        longStayLegend: 'ស្នាក់នៅរយៈពេលវែង (កំពុងប្រើ)',
    },
};
