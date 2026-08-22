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

export type RoomBookedRange = {
    start: string;
    end: string;
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

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/** Shape of `$paginator->through(...)` — pagination fields sit at the top level. */
export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
};

/**
 * Shape of `SomeResource::collection($paginator)` — Laravel nests the pagination
 * fields under `meta` and replaces `links` with first/last/prev/next URLs.
 * Not interchangeable with {@link Paginated}.
 */
export type PaginatedResource<T> = {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        path: string;
        links: PaginationLink[];
    };
};
