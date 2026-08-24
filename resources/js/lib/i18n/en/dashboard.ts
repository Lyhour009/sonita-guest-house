export const dashboard = {
    guest: {
        title: 'My dashboard',
        currentReservations: 'Current reservations',
        noActiveReservations: 'You have no active reservations.',
        latestInvoice: 'Latest invoice',
        noInvoices: 'You have no invoices yet.',
        recentNotifications: 'Recent notifications',
        noNotifications: 'You have no notifications yet.',
        reviewableTitle: 'How was your stay?',
        leaveReview: 'Leave a review',
        reviewDialog: {
            title: 'Review Room {{room}}',
            ratingLabel: 'Your rating',
            commentLabel: 'Comment (optional)',
            commentPlaceholder: 'Tell us about your stay...',
            submit: 'Submit review',
        },
    },
    receptionist: {
        title: 'Front desk dashboard',
        todaysArrivals: "Today's arrivals ({{count}})",
        noArrivals: 'No arrivals expected today.',
        todaysDepartures: "Today's departures ({{count}})",
        noDepartures: 'No departures expected today.',
        noRooms: 'No rooms have been added yet.',
    },
    housekeeping: {
        title: 'Housekeeping dashboard',
        roomsAwaitingCleaning: 'Rooms awaiting cleaning',
        openAssignedMaintenance: 'Open assigned maintenance',
    },
};
