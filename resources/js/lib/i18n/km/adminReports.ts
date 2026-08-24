import type { adminReports as adminReportsEn } from '../en/adminReports';

export const adminReports: typeof adminReportsEn = {
    title: 'របាយការណ៍',
    subtitle:
        'ចំណូល ការកាន់កាប់បន្ទប់ និងលទ្ធផលការជួសជុលសម្រាប់ចន្លោះកាលបរិច្ឆេទដែលបានជ្រើសរើស។',
    fromLabel: 'ចាប់ពី',
    toLabel: 'ដល់',
    apply: 'អនុវត្ត',
    exportCsv: 'នាំចេញ CSV',
    exportPdf: 'នាំចេញ PDF',
    stats: {
        revenue: 'ចំណូល',
        reservationsCreated: 'ការកក់ដែលបានបង្កើត',
        outstandingInvoices: 'វិក្កយបត្រមិនទាន់បង់',
        maintenanceResolved: 'ការជួសជុលបានដោះស្រាយ',
        maintenanceNew: 'សំណើជួសជុលថ្មី',
        avgResolutionTime: 'រយៈពេលដោះស្រាយជាមធ្យម',
        hoursSuffix: 'ម៉ោង',
        notAvailable: 'មិនមាន',
    },
    chart: {
        title: 'ចំណូលក្នុងចន្លោះពេល',
        totalEarned: 'សរុបក្នុងចន្លោះពេល',
        dailyAverage: 'មធ្យមភាគប្រចាំថ្ងៃ',
    },
};
