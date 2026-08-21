import type { Dictionary } from '../translate';

export const services: Dictionary['services'] = {
    title: 'សេវាកម្ម',
    table: {
        name: 'ឈ្មោះ',
        price: 'តម្លៃ',
    },
    empty: 'មិនទាន់មានសេវាកម្មនៅឡើយទេ។',
    addService: 'បន្ថែមសេវាកម្ម',
    createService: 'បង្កើតសេវាកម្ម',
    editService: 'កែសម្រួល {{name}}',
    deleteService: {
        title: 'លុប {{name}}?',
        description: 'មិនអាចត្រឡប់វិញបានទេ។',
    },
    form: {
        name: 'ឈ្មោះ',
        price: 'តម្លៃ ($)',
    },
};
