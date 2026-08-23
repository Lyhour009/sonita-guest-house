export type StaffRole = 'receptionist' | 'housekeeping';

export type StaffAccount = {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    role: StaffRole;
    assigned_open_count: number | null;
    assigned_overdue_count: number | null;
};

export type StaffStats = {
    total: number;
    receptionists: number;
    housekeeping: number;
    openAssignments: number;
};
