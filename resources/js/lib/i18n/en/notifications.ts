export const notifications = {
    page: {
        title: 'Notifications',
        markAllRead: 'Mark all as read',
        markRead: 'Mark read',
        empty: 'You have no notifications yet.',
        newBadge: 'New',
    },
    bell: {
        srLabel: 'Notifications',
    },
    types: {
        maintenance_assigned: 'Maintenance assigned',
        reservation_confirmed: 'Reservation confirmed',
        payment_confirmed: 'Payment confirmed',
        maintenance_status_changed: 'Maintenance update',
        invoice_issued: 'Invoice issued',
        stay_completed: 'How was your stay?',
    },
    messages: {
        maintenance_assigned:
            'You’ve been assigned to the maintenance request "{{title}}" (Room {{room}}).',
        reservation_confirmed:
            'Your reservation for Room {{room}} has been confirmed.',
        payment_confirmed: 'Your payment of ${{amount}} has been confirmed.',
        maintenance_status_changed:
            'Your maintenance request "{{title}}" is now {{status}}.',
        invoice_issued:
            'A new invoice of ${{amount}} has been issued for Room {{room}}.',
        stay_completed:
            'Thanks for staying with us! We’d love to hear about your stay in Room {{room}}.',
    },
};
