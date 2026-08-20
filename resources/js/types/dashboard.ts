import type { AppNotification } from '@/types/notification';

export type GuestDashboardReservation = {
    id: string;
    reservation_type: 'short_stay' | 'long_stay';
    status: string;
    check_in_date: string | null;
    check_out_date: string | null;
    start_date: string | null;
    end_date: string | null;
    room: { room_number: string; room_type: string };
};

export type GuestDashboardInvoice = {
    id: string;
    invoice_type: 'short_stay' | 'long_stay';
    total_amount: string;
    status: string;
    due_date: string | null;
    room: { room_number: string };
};

export type GuestDashboardData = {
    reservations: GuestDashboardReservation[];
    latestInvoice: GuestDashboardInvoice | null;
    notifications: AppNotification[];
};

export type ReceptionistDashboardEntry = {
    id: string;
    guest: { full_name: string };
    room: { room_number: string };
};

export type ReceptionistDashboardRoom = {
    id: string;
    room_number: string;
    status: string;
};

export type ReceptionistDashboardData = {
    arrivals: ReceptionistDashboardEntry[];
    departures: ReceptionistDashboardEntry[];
    rooms: ReceptionistDashboardRoom[];
};

export type HousekeepingDashboardData = {
    roomsAwaitingCleaning: number;
    openAssignedMaintenance: number;
};

export type AdminDashboardData = {
    occupancy: {
        short_stay: number;
        long_stay: number;
        total_rooms: number;
    };
    revenueThisMonth: number;
    outstandingInvoicesCount: number;
    openMaintenanceCount: number;
};
