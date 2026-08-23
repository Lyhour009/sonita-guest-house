export const settingsPage = {
    title: 'Settings',
    description: 'Rates, tax, check-in/out times, and payment instructions',
    sections: {
        general: 'Currency & tax',
        stayTimes: 'Check-in / check-out',
        rates: 'Utility rates & fees',
        payment: 'Payment instructions',
        preview: 'Live preview',
    },
    fields: {
        currency: 'Currency',
        taxRate: 'Tax rate (%)',
        defaultCheckinTime: 'Default check-in time',
        defaultCheckoutTime: 'Default check-out time',
        electricRate: 'Electric rate (per unit)',
        waterRate: 'Water rate (per unit)',
        lateFee: 'Late fee',
        paymentQrUrl: 'Payment QR URL (optional)',
        paymentInstruction: 'Payment instructions (optional)',
    },
    payment: {
        previewAlt: 'Payment QR code preview',
        previewHint: 'This is how the QR code will look to guests.',
        previewError: 'Could not load an image from this URL.',
    },
    preview: {
        description:
            'A quick example using a ${{amount}}/night room, so you can sanity-check these numbers before saving.',
        total: 'Room total (1 night)',
        tax: 'Tax ({{rate}}%)',
        electricity: 'Electricity ({{units}} units)',
        water: 'Water ({{units}} units)',
        lateFee: 'Late fee (per day)',
    },
};
