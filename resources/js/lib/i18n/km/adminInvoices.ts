import type { Dictionary } from '../translate';

export const adminInvoices: Dictionary['adminInvoices'] = {
    title: 'វិក្កយបត្រ',
    statusFilter: {
        placeholder: 'ស្ថានភាព',
        any: 'គ្រប់ស្ថានភាព',
    },
    table: {
        billingPeriod: 'រយៈពេលគិតប្រាក់',
    },
    empty: 'គ្មានវិក្កយបត្រណាត្រូវនឹងតម្រងរបស់អ្នកទេ។',
    generateInvoice: 'បង្កើតវិក្កយបត្រ',
    dialog: {
        title: 'បង្កើតវិក្កយបត្រសម្រាប់ស្នាក់នៅរយៈពេលវែង',
        tenant: 'អ្នកជួល',
        billingMonth: 'ខែគិតប្រាក់ (ស្រេចចិត្ត ប្រើខែបច្ចុប្បន្នជាលំនាំដើម)',
        electricMeterStart: 'ចំនួនរាប់អគ្គិសនីចាប់ផ្តើម',
        electricMeterEnd: 'ចំនួនរាប់អគ្គិសនីបញ្ចប់',
        waterMeterStart: 'ចំនួនរាប់ទឹកចាប់ផ្តើម',
        waterMeterEnd: 'ចំនួនរាប់ទឹកបញ្ចប់',
        submit: 'បង្កើត',
    },
};
