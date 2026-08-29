export const payments = {
    page: {
        title: 'My payments',
        subtitle: 'Payments you have submitted, and their confirmation status.',
        empty: "You haven't submitted any payments yet.",
        emptyDescription: 'Pay an invoice to see your payments here.',
    },
    table: {
        amount: 'Amount',
        method: 'Method',
        submitted: 'Submitted',
        proof: 'Proof',
    },
    proof: {
        view: 'View',
    },
    method: {
        cash: 'Cash',
        bank_transfer: 'Bank transfer',
        qr: 'QR payment',
    },
    submitDialog: {
        trigger: 'Pay',
        title: 'Pay invoice · {{roomNumber}}',
        amount: 'Amount ($)',
        method: 'Payment method',
        proofOptional: 'Proof of payment (optional)',
        submit: 'Submit payment',
    },
};
