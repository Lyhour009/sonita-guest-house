import type { notifications as notificationsEn } from '../en/notifications';

export const notifications: typeof notificationsEn = {
    page: {
        title: 'ការជូនដំណឹង',
        markAllRead: 'សម្គាល់ថាបានអានទាំងអស់',
        markRead: 'សម្គាល់ថាបានអាន',
        empty: 'អ្នកមិនទាន់មានការជូនដំណឹងនៅឡើយទេ។',
        newBadge: 'ថ្មី',
    },
    bell: {
        srLabel: 'ការជូនដំណឹង',
    },
    types: {
        maintenance_assigned: 'បានចាត់តាំងការជួសជុល',
        reservation_confirmed: 'ការកក់បានបញ្ជាក់',
        payment_confirmed: 'ការទូទាត់បានបញ្ជាក់',
        maintenance_status_changed: 'ស្ថានភាពការជួសជុលថ្មី',
        invoice_issued: 'វិក្កយបត្របានចេញ',
    },
    messages: {
        maintenance_assigned:
            'អ្នកត្រូវបានចាត់តាំងទៅសំណើជួសជុល "{{title}}" (បន្ទប់ {{room}})។',
        reservation_confirmed:
            'ការកក់របស់អ្នកសម្រាប់បន្ទប់ {{room}} ត្រូវបានបញ្ជាក់។',
        payment_confirmed:
            'ការទូទាត់ចំនួន ${{amount}} របស់អ្នកត្រូវបានបញ្ជាក់។',
        maintenance_status_changed:
            'សំណើជួសជុល "{{title}}" របស់អ្នកឥឡូវនេះគឺ {{status}}។',
        invoice_issued:
            'វិក្កយបត្រថ្មីចំនួន ${{amount}} ត្រូវបានចេញសម្រាប់បន្ទប់ {{room}}។',
    },
};
