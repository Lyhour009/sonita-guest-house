import type { Dictionary } from '../translate';

export const staffAccounts: Dictionary['staffAccounts'] = {
    title: 'បុគ្គលិក',
    subtitle: 'គ្រប់គ្រងគណនីបុគ្គលិកទទួលភ្ញៀវ និងបុគ្គលិកសម្អាតបន្ទប់។',
    searchPlaceholder: 'ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល...',
    filters: {
        role: 'តួនាទី',
        anyRole: 'គ្រប់តួនាទី',
    },
    roles: {
        receptionist: 'បុគ្គលិកទទួលភ្ញៀវ',
        housekeeping: 'បុគ្គលិកសម្អាតបន្ទប់',
    },
    stats: {
        total: 'បុគ្គលិកសរុប',
        receptionists: 'បុគ្គលិកទទួលភ្ញៀវ',
        housekeeping: 'បុគ្គលិកសម្អាតបន្ទប់',
        openAssignments: 'ការចាត់តាំងកំពុងបើក',
    },
    table: {
        name: 'ឈ្មោះ',
        email: 'អ៊ីមែល',
        phone: 'លេខទូរស័ព្ទ',
        workload: 'បន្ទុកការងារ',
    },
    workloadOpen: '{{count}} កំពុងបើក',
    workloadNone: '—',
    overdue: 'ហួសកំណត់',
    empty: 'គ្មានគណនីបុគ្គលិកណាត្រូវនឹងតម្រងរបស់អ្នកទេ។',
    emptyDescription:
        'បន្ថែមគណនីបុគ្គលិកទទួលភ្ញៀវ ឬសម្អាតបន្ទប់ដើម្បីចាប់ផ្តើម។',
    showingCount: 'កំពុងបង្ហាញ {{shown}} នៃ {{total}} បុគ្គលិក',
    addAccount: 'បន្ថែមគណនីបុគ្គលិក',
    createAccount: 'បង្កើតគណនី',
    editAccount: 'កែសម្រួល {{name}}',
    deleteAccount: {
        title: 'លុប {{name}}?',
        description: 'មិនអាចត្រឡប់វិញបានទេ។',
    },
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
