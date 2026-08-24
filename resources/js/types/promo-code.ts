export type PromoCode = {
    id: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    active: boolean;
    expires_at: string | null;
    max_uses: number | null;
    used_count: number;
};
