export type AppNotification = {
    id: string;
    type: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string | null;
};

export type AppSettings = {
    currency: string;
    tax_rate: string;
    default_checkin_time: string;
    default_checkout_time: string;
    electric_rate: string;
    water_rate: string;
    late_fee: string;
    payment_qr_url: string | null;
    payment_instruction: string | null;
};
