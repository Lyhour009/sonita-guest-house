import type { welcome as welcomeEn } from '../en/welcome';

export const welcome: typeof welcomeEn = {
    header: {
        brand: 'ផ្ទះសំណាក់ ហួរ',
        address: 'ផ្លូវលេខ 644, សង្កាត់ចាក់អង្រែទី១, ខណ្ឌចាក់អង្រែ, ភ្នំពេញ',
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
    },
};
