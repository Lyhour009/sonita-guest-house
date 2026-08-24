export type WaitlistEntry = {
    id: string;
    email: string;
    phone_number: string | null;
    stay_type: 'short_stay' | 'long_stay';
    from_date: string | null;
    to_date: string | null;
    notified_at: string | null;
    created_at: string | null;
};
