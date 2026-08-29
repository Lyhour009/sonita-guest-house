export const toasts = {
    rooms: {
        created: 'Room created.',
        updated: 'Room updated.',
        deleted: 'Room deleted.',
        imagesUploaded: 'Images uploaded.',
        imageRemoved: 'Image removed.',
    },
    services: {
        created: 'Service created.',
        updated: 'Service updated.',
        deleted: 'Service deleted.',
        inUse: 'Cannot delete — this service is used in bookings.',
    },
    settings: {
        updated: 'Settings updated.',
    },
    staffAccounts: {
        created: 'Staff account created.',
        updated: 'Staff account updated.',
        deleted: 'Staff account deleted.',
        inUse: 'Cannot delete — this staff account has maintenance history.',
    },
    invoices: {
        generated: 'Invoice generated.',
    },
    maintenance: {
        submitted: 'Maintenance request submitted.',
        assigned: 'Maintenance request assigned.',
        updated: 'Maintenance request updated.',
    },
    payments: {
        submitted: 'Payment submitted — awaiting confirmation.',
        confirmed: 'Payment confirmed.',
        rejected: 'Payment rejected.',
    },
    reservations: {
        requested: 'Reservation requested — awaiting confirmation.',
        cancelled: 'Reservation cancelled.',
        createdByStaff: 'Reservation created successfully.',
        confirmed: 'Reservation confirmed.',
        checkedIn: 'Check-in completed successfully.',
        checkedOut: 'Check-out completed successfully.',
        notesUpdated: 'Reservation notes updated.',
    },
    profile: {
        updated: 'Profile updated.',
    },
    security: {
        passwordUpdated: 'Password updated.',
    },
    housekeeping: {
        roomCleaned: 'Room marked as clean.',
    },
    waitlist: {
        joined: 'You’re on the waitlist — we’ll email you if a room opens up.',
        notified: 'Waitlist entry notified.',
    },
    reviews: {
        created: 'Thanks for your review!',
    },
    promoCodes: {
        created: 'Promo code created.',
        updated: 'Promo code updated.',
        deleted: 'Promo code deleted.',
    },
    auth: {
        loggedIn: 'Welcome back!',
        registered: 'Account created — welcome!',
        loggedOut: 'You have been logged out.',
    },
};
