import type { payments as paymentsEn } from '../en/payments';

export const payments: typeof paymentsEn = {
    page: {
        title: 'ការទូទាត់របស់ខ្ញុំ',
        empty: 'អ្នកមិនទាន់បានដាក់ស្នើការទូទាត់ណាមួយនៅឡើយទេ។',
    },
    table: {
        amount: 'ចំនួនទឹកប្រាក់',
        method: 'វិធីទូទាត់',
        submitted: 'ថ្ងៃដាក់ស្នើ',
        proof: 'ភស្តុតាង',
    },
    proof: {
        view: 'មើល',
    },
    method: {
        cash: 'សាច់ប្រាក់',
        bank_transfer: 'ផ្ទេរប្រាក់តាមធនាគារ',
        qr: 'ទូទាត់ដោយ QR',
    },
    submitDialog: {
        trigger: 'បង់ប្រាក់',
        title: 'បង់វិក្កយបត្រ · {{roomNumber}}',
        amount: 'ចំនួនទឹកប្រាក់ ($)',
        method: 'វិធីទូទាត់',
        proofOptional: 'ភស្តុតាងទូទាត់ (ស្រេចចិត្ត)',
        submit: 'ដាក់ស្នើការទូទាត់',
    },
};
