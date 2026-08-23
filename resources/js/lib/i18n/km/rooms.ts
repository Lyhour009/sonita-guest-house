import type { rooms as roomsEn } from '../en/rooms';

export const rooms: typeof roomsEn = {
    stayType: {
        label: 'ប្រភេទស្នាក់នៅ',
        any: 'ទាំងអស់',
        shortStayNightly: 'ស្នាក់នៅរយៈពេលខ្លី (គិតជាយប់)',
        longStayMonthly: 'ស្នាក់នៅរយៈពេលវែង (គិតជាខែ)',
    },
    rentalModeBadge: {
        short_stay: 'ស្នាក់នៅរយៈពេលខ្លី',
        long_stay: 'ស្នាក់នៅរយៈពេលវែង',
        both: 'ស្នាក់នៅរយៈពេលខ្លី និងវែង',
    },
    rentalModeDetail: {
        short_stay: 'សម្រាប់ស្នាក់នៅរយៈពេលខ្លីតែប៉ុណ្ណោះ',
        long_stay: 'សម្រាប់ស្នាក់នៅរយៈពេលវែងតែប៉ុណ្ណោះ',
        both: 'ស្នាក់នៅរយៈពេលខ្លី និងវែង',
    },
    maxOccupants: {
        one: 'ស្នាក់នៅបានរហូតដល់ {{count}} ភ្ញៀវ',
        other: 'ស្នាក់នៅបានរហូតដល់ {{count}} ភ្ញៀវ',
    },
    detail: {
        backToRooms: '← ត្រឡប់ទៅបញ្ជីបន្ទប់',
        heading: '{{type}} · បន្ទប់ {{number}}',
        floor: 'ជាន់ទី {{floor}}',
        groundFloor: 'ជាន់ផ្ទាល់ដី',
        perNight: 'តម្លៃក្នុងមួយយប់',
        perMonth: 'តម្លៃក្នុងមួយខែ',
        monthlyRate: 'អត្រាប្រចាំខែ',
        description: 'ការពិពណ៌នា',
        amenities: 'សម្ភារៈបរិក្ខារ',
        staffCannotBook: 'គណនីបុគ្គលិកមិនអាចធ្វើការកក់បានទេ',
    },
    availability: {
        heading: 'ភាពទំនេរ',
        booked: 'បានកក់',
    },
};
