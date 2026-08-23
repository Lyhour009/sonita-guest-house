export const adminRooms = {
    title: 'Rooms',
    description:
        'Manage all your properties, pricing, and statuses in one place.',
    searchPlaceholder: 'Search by room number or type...',
    filters: {
        rentalMode: 'Rental mode',
        anyRentalMode: 'Any rental mode',
        anyStatus: 'Any status',
        both: 'Both',
    },
    table: {
        rentalMode: 'Rental mode',
        pricePerNight: 'Price / night',
        pricePerMonth: 'Price / month',
    },
    empty: 'No rooms match your filters.',
    emptyDescription:
        'Create a new room to start managing your guest house inventory.',
    addRoom: 'Add room',
    createRoom: 'Create room',
    editRoom: 'Edit room {{roomNumber}}',
    duplicateRoom: 'Duplicate room {{roomNumber}}',
    duplicate: 'Duplicate',
    images: 'Images',
    hasNotes: 'Has internal notes',
    deleteRoom: {
        title: 'Delete room {{roomNumber}}?',
        description:
            'This will permanently delete the room and its images. This cannot be undone.',
    },
    imageManager: {
        remove: 'Remove',
        noImages: 'No images uploaded yet.',
        upload: 'Upload images',
    },
    form: {
        roomNumber: 'Room number',
        roomType: 'Room type',
        roomTypePlaceholder: 'Standard, Deluxe, Suite...',
        rentalModeShortStayOnly: 'Short stay only',
        rentalModeLongStayOnly: 'Long stay only',
        rentalModeBoth: 'Short & long stay',
        pricePerNight: 'Price per night ($)',
        pricePerMonth: 'Price per month ($)',
        floor: 'Floor',
        maxOccupants: 'Max occupants',
        amenities: 'Amenities',
        amenitiesPlaceholder: 'Wi-Fi, Air conditioning, Hot water...',
        description: 'Description',
        notes: 'Internal notes (staff only)',
        notesPlaceholder: 'AC unit noisy, part on order...',
    },
};
