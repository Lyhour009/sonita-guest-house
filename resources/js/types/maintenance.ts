export type MaintenancePriority = 'low' | 'medium' | 'high';
export type MaintenanceStatus =
    'pending' | 'in_progress' | 'resolved' | 'cancelled';

export type MaintenanceRoomSummary = {
    id: string;
    room_number: string;
};

export type MaintenanceRequest = {
    id: string;
    title: string;
    description: string | null;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    created_at: string | null;
    room: MaintenanceRoomSummary;
};

export type StaffMaintenanceRequest = MaintenanceRequest & {
    reporter: { full_name: string };
    assignee: { id: string; full_name: string } | null;
};

export type HousekeepingStaffOption = {
    id: string;
    full_name: string;
};

export type CleaningRoom = {
    id: string;
    room_number: string;
    room_type: string;
    floor: number | null;
};
