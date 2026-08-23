import type { Dictionary } from '../translate';

export const settingsPage: Dictionary['settingsPage'] = {
    title: 'ការកំណត់',
    description: 'អត្រាតម្លៃ ពន្ធ ម៉ោងចូល/ចេញស្នាក់នៅ និងការណែនាំទូទាត់ប្រាក់',
    sections: {
        general: 'រូបិយប័ណ្ណ និងពន្ធ',
        stayTimes: 'ម៉ោងចូល / ចេញស្នាក់នៅ',
        rates: 'អត្រាឧបករណ៍ប្រើប្រាស់ និងថ្លៃពិន័យ',
        payment: 'ការណែនាំទូទាត់ប្រាក់',
        preview: 'ការមើលជាមុនផ្ទាល់',
    },
    fields: {
        currency: 'រូបិយប័ណ្ណ',
        taxRate: 'អត្រាពន្ធ (%)',
        defaultCheckinTime: 'ម៉ោងចូលស្នាក់នៅលំនាំដើម',
        defaultCheckoutTime: 'ម៉ោងចេញលំនាំដើម',
        electricRate: 'អត្រាថ្លៃអគ្គិសនី (ក្នុងមួយឯកតា)',
        waterRate: 'អត្រាថ្លៃទឹក (ក្នុងមួយឯកតា)',
        lateFee: 'ថ្លៃពិន័យយឺតយ៉ាវ',
        paymentQrUrl: 'តំណ QR ទូទាត់ប្រាក់ (ស្រេចចិត្ត)',
        paymentInstruction: 'ការណែនាំទូទាត់ប្រាក់ (ស្រេចចិត្ត)',
    },
    payment: {
        previewAlt: 'ការមើលជាមុនកូដ QR ទូទាត់ប្រាក់',
        previewHint: 'នេះជារូបភាពដែលភ្ញៀវនឹងឃើញកូដ QR នេះ។',
        previewError: 'មិនអាចផ្ទុករូបភាពពីតំណនេះបានទេ។',
    },
    preview: {
        description:
            'ឧទាហរណ៍រហ័សដោយប្រើបន្ទប់តម្លៃ ${{amount}}/យប់ ដើម្បីពិនិត្យមើលលេខទាំងនេះមុននឹងរក្សាទុក។',
        total: 'សរុបបន្ទប់ (១ យប់)',
        tax: 'ពន្ធ ({{rate}}%)',
        electricity: 'អគ្គិសនី ({{units}} ឯកតា)',
        water: 'ទឹក ({{units}} ឯកតា)',
        lateFee: 'ថ្លៃពិន័យយឺតយ៉ាវ (ក្នុងមួយថ្ងៃ)',
    },
};
