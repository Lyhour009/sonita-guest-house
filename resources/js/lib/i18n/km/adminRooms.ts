import type { Dictionary } from '../translate';

export const adminRooms: Dictionary['adminRooms'] = {
    title: 'បន្ទប់',
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
    addRoom: 'បន្ថែមបន្ទប់',
    createRoom: 'បង្កើតបន្ទប់',
    editRoom: 'កែសម្រួលបន្ទប់ {{roomNumber}}',
    images: 'រូបភាព',
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
    },
};
