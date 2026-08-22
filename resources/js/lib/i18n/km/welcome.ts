import type { welcome as welcomeEn } from '../en/welcome';

export const welcome: typeof welcomeEn = {
    header: {
        brand: 'ផ្ទះសំណាក់ ហួរ',
        address: 'ផ្លូវលេខ 644, សង្កាត់ចាក់អង្រែទី១, ខណ្ឌចាក់អង្រែ, ភ្នំពេញ',
    },
    hero: {
        headline: 'បន្ទប់សម្រាប់មួយយប់ ឬសម្រាប់មួយឆ្នាំ។',
    },
    stay: {
        selected: 'បានជ្រើសរើស',
        short: {
            title: 'ស្នាក់នៅពីរបីយប់',
            billing: 'គិតថ្លៃតាមយប់',
            checkIn: 'ថ្ងៃចូល',
            checkOut: 'ថ្ងៃចេញ',
            fromPrice: 'ចាប់ពី {{price}} / យប់',
            action: 'ស្វែងរកបន្ទប់',
        },
        long: {
            title: 'ស្នាក់នៅពីរបីខែ',
            billing: 'គិតថ្លៃតាមខែ និងថ្លៃទឹកភ្លើងតាមកុងទ័រ',
            moveIn: 'ថ្ងៃចូលរស់នៅ',
            until: 'រហូតដល់',
            fromPrice: 'ចាប់ពី {{price}} / ខែ',
            action: 'មើលបន្ទប់ប្រចាំខែ',
        },
    },
    results: {
        heading: 'បន្ទប់ទំនេរ',
        countOne: 'បន្ទប់ {{count}}',
        countOther: 'បន្ទប់ {{count}}',
    },
    filters: {
        from: 'ចាប់ពី',
        to: 'ដល់',
    },
    empty: {
        noResults: 'មិនមានបន្ទប់ត្រូវនឹងការស្វែងរករបស់អ្នកទេ។',
    },
    card: {
        perNightSuffix: '/ យប់',
        perMonthSuffix: '/ ខែ',
        viewRoom: 'មើលបន្ទប់',
        orPerMonth: 'ឬ {{price}} / ខែ',
        orPerNight: 'ឬ {{price}} / យប់',
        nightlyOnly: 'តាមយប់ប៉ុណ្ណោះ',
        monthlyOnly: 'តាមខែប៉ុណ្ណោះ',
        noPhoto: 'រូបភាពនឹងមកដល់ឆាប់ៗ',
    },
};
