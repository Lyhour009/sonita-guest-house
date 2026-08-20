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
};

export type ReservationGuestSummary = {
    id: string;
    full_name: string;
    email: string;
};

export type Reservation = {
    id: string;
    reservation_type: ReservationType;
    check_in_date: string | null;
    check_out_date: string | null;
    start_date: string | null;
    end_date: string | null;
    status: ReservationStatus;
    room: ReservationRoomSummary;
};

export type StaffReservation = Reservation & {
    guest: ReservationGuestSummary;
};
