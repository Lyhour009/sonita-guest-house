import type { Dictionary } from '../translate';

export const adminRooms: Dictionary['adminRooms'] = {
    title: 'បន្ទប់',
    description: 'គ្រប់គ្រងបន្ទប់ តម្លៃ និងស្ថានភាពនៅកន្លែងតែមួយ។',
    searchPlaceholder: 'ស្វែងរកតាមលេខបន្ទប់ ឬប្រភេទបន្ទប់...',
    filters: {
        rentalMode: 'ទម្រង់ជួល',
        anyRentalMode: 'គ្រប់ទម្រង់ជួល',
        anyStatus: 'គ្រប់ស្ថានភាព',
        both: 'ទាំងពីរ',
    },
    table: {
        rentalMode: 'ទម្រង់ជួល',
        pricePerNight: 'តម្លៃ / យប់',
        pricePerMonth: 'តម្លៃ / ខែ',
    },
    empty: 'គ្មានបន្ទប់ណាត្រូវនឹងតម្រងរបស់អ្នកទេ។',
    emptyDescription:
        'បង្កើតបន្ទប់ថ្មីដើម្បីចាប់ផ្តើមគ្រប់គ្រងស្តុកបន្ទប់ផ្ទះសំណាករបស់អ្នក។',
    addRoom: 'បន្ថែមបន្ទប់',
    createRoom: 'បង្កើតបន្ទប់',
    editRoom: 'កែសម្រួលបន្ទប់ {{roomNumber}}',
    duplicateRoom: 'ចម្លងបន្ទប់ {{roomNumber}}',
    duplicate: 'ចម្លង',
    images: 'រូបភាព',
    hasNotes: 'មានកំណត់ចំណាំផ្ទៃក្នុង',
    deleteRoom: {
        title: 'លុបបន្ទប់ {{roomNumber}}?',
        description:
            'សកម្មភាពនេះនឹងលុបបន្ទប់និងរូបភាពរបស់វាជាអចិន្ត្រៃយ៍។ មិនអាចត្រឡប់វិញបានទេ។',
    },
    imageManager: {
        remove: 'លុប',
        noImages: 'មិនទាន់មានរូបភាពបញ្ចូលឡើងនៅឡើយទេ។',
        upload: 'បញ្ចូលរូបភាព',
    },
    form: {
        roomNumber: 'លេខបន្ទប់',
        roomType: 'ប្រភេទបន្ទប់',
        roomTypePlaceholder: 'ស្តង់ដារ, ឌឺលុច, ស៊្វីត...',
        rentalModeShortStayOnly: 'ស្នាក់នៅរយៈពេលខ្លីតែប៉ុណ្ណោះ',
        rentalModeLongStayOnly: 'ស្នាក់នៅរយៈពេលវែងតែប៉ុណ្ណោះ',
        rentalModeBoth: 'ស្នាក់នៅទាំងរយៈពេលខ្លីនិងវែង',
        pricePerNight: 'តម្លៃក្នុងមួយយប់ ($)',
        pricePerMonth: 'តម្លៃក្នុងមួយខែ ($)',
        floor: 'ជាន់',
        maxOccupants: 'ចំនួនអ្នកស្នាក់នៅអតិបរមា',
        amenities: 'សម្ភារៈបរិក្ខារ',
        amenitiesPlaceholder: 'វាយហ្វាយ, ម៉ាស៊ីនត្រជាក់, ទឹកក្តៅ...',
        description: 'ការពិពណ៌នា',
        notes: 'កំណត់ចំណាំផ្ទៃក្នុង (សម្រាប់បុគ្គលិកតែប៉ុណ្ណោះ)',
        notesPlaceholder:
            'ម៉ាស៊ីនត្រជាក់មានសំឡេងរំខាន កំពុងកម្មង់គ្រឿងបន្លាស់...',
    },
};
