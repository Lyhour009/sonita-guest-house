export type RoomStatus =
    'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';

export type RentalMode = 'short_stay' | 'long_stay' | 'both';

export type RoomImage = {
    id: string;
    url: string;
};

export type RoomSummary = {
    id: string;
    room_number: string;
    room_type: string;
    rental_mode: RentalMode;
    price_per_night: string;
    price_per_month: string;
    max_occupants: number;
    thumbnail: string | null;
};

export type RoomDetail = {
    id: string;
    room_number: string;
    room_type: string;
    rental_mode: RentalMode;
    price_per_night: string;
    price_per_month: string;
    status: RoomStatus;
    floor: number | null;
    max_occupants: number;
    amenities: string | null;
    description: string | null;
    images: RoomImage[];
};

export type RoomOption = {
    id: string;
    room_number: string;
    room_type: string;
    rental_mode: RentalMode;
    max_occupants: number;
};

export type RoomFilters = {
    stay_type: 'short_stay' | 'long_stay' | null;
    from: string | null;
    to: string | null;
};

export type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
};
