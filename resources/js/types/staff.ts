export type StaffRole = 'receptionist' | 'housekeeping';

export type StaffAccount = {
    id: string;
    full_name: string;
    email: string;
    phone_number: string | null;
    role: StaffRole;
};
