import type { Dictionary } from '../translate';

export const staffAccounts: Dictionary['staffAccounts'] = {
    title: 'បុគ្គលិក',
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល...',
    filters: {
        role: 'តួនាទី',
        anyRole: 'គ្រប់តួនាទី',
    },
    roles: {
        receptionist: 'បុគ្គលិកទទួលភ្ញៀវ',
        housekeeping: 'បុគ្គលិកសម្អាតបន្ទប់',
    },
    table: {
        name: 'ឈ្មោះ',
        email: 'អ៊ីមែល',
        phone: 'លេខទូរស័ព្ទ',
    },
    empty: 'គ្មានគណនីបុគ្គលិកណាត្រូវនឹងតម្រងរបស់អ្នកទេ។',
    addAccount: 'បន្ថែមគណនីបុគ្គលិក',
    createAccount: 'បង្កើតគណនី',
    editAccount: 'កែសម្រួល {{name}}',
    form: {
        fullName: 'ឈ្មោះពេញ',
        email: 'អ៊ីមែល',
        phoneNumber: 'លេខទូរស័ព្ទ (ស្រេចចិត្ត)',
        role: 'តួនាទី',
        password: 'ពាក្យសម្ងាត់',
        confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
        newPassword: 'ពាក្យសម្ងាត់ថ្មី (ស្រេចចិត្ត)',
        newPasswordPlaceholder: 'ទុកចោលទទេប្រសិនបើមិនចង់ប្តូរពាក្យសម្ងាត់',
        confirmNewPassword: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី',
    },
};
