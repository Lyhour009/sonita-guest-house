export type InvoiceType = 'short_stay' | 'long_stay';
export type InvoiceStatus = 'unpaid' | 'partial' | 'paid';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'qr';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export type InvoiceRoomSummary = {
    room_number: string;
    room_type?: string;
};

export type Invoice = {
    id: string;
    invoice_type: InvoiceType;
    billing_period: string | null;
    room_charge: string;
    service_charge: string;
    utility_charge: string | null;
    tax_amount: string;
    total_amount: string;
    status: InvoiceStatus;
    due_date: string | null;
    outstanding_balance: number;
    room: InvoiceRoomSummary;
};

export type AdminInvoice = {
    id: string;
    invoice_type: InvoiceType;
    billing_period: string | null;
    total_amount: string;
    status: InvoiceStatus;
    due_date: string | null;
    guest: { full_name: string };
    room: InvoiceRoomSummary;
};

export type Payment = {
    id: string;
    amount: string;
    method: PaymentMethod;
    status: PaymentStatus;
    has_proof: boolean;
    paid_at: string | null;
    created_at: string | null;
    room: InvoiceRoomSummary;
};

export type StaffPayment = Payment & {
    guest: { full_name: string; email: string };
};

export type ActiveLongStayReservationOption = {
    id: string;
    guest_name: string;
    room_number: string;
};
