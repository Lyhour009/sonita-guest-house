export type ReservationType = 'short_stay' | 'long_stay';

export type ReservationStatus =
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'checked_out'
    | 'active'
    | 'expired'
    | 'cancelled'
    | 'terminated';

export type ReservationRoomSummary = {
    id: string;
    room_number: string;
    room_type: string;
    price_per_night?: number;
    price_per_month?: number;
};

export type ReservationGuestSummary = {
    id: string;
    full_name: string;
    email: string;
    phone_number?: string | null;
};

export type ReservationInvoiceSummary = {
    id: string;
    total_amount: number;
    room_charge?: number;
    service_charge?: number;
    tax_amount?: number;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'unpaid';
    due_date?: string | null;
};

export type ReservationServiceSummary = {
    id: string;
    name: string;
    price: number;
    pivot_id: number;
    quantity: number;
    unit_price: number;
};

export type Reservation = {
    id: string;
    reservation_type: ReservationType;
    check_in_date: string | null;
    check_out_date: string | null;
    start_date: string | null;
    end_date: string | null;
    status: ReservationStatus;
    notes: string | null;
    deposit_amount?: number | null;
    monthly_due_day?: number | null;
    num_guests?: number | null;
    created_at?: string;
    room: ReservationRoomSummary;
    total_amount: number;
};

export type StaffReservation = Reservation & {
    guest: ReservationGuestSummary;
    latest_invoice?: ReservationInvoiceSummary | null;
    services?: ReservationServiceSummary[];
};

export type TimelineBooking = {
    id: string;
    guest_name: string;
    reservation_type: ReservationType;
    status: ReservationStatus;
    start_date: string;
    end_date: string;
};

export type TimelineRoom = {
    id: string;
    room_number: string;
    room_type: string;
    status: string;
    bookings: TimelineBooking[];
};
