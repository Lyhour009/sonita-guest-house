import type { Dictionary } from '../translate';

export const settingsPage: Dictionary['settingsPage'] = {
    title: 'ការកំណត់',
    description: 'អត្រាតម្លៃ ពន្ធ ម៉ោងចូល/ចេញស្នាក់នៅ និងការណែនាំទូទាត់ប្រាក់',
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
};
