import type { RevenueTrendPoint } from '@/types/dashboard';

export type AdminReport = {
    revenue: number;
    revenueByDay: RevenueTrendPoint[];
    reservationsCreatedCount: number;
    outstandingInvoicesCount: number;
    maintenanceResolvedCount: number;
    maintenanceNewCount: number;
    maintenanceAvgResolutionHours: number | null;
};

export type ReportFilters = {
    from: string;
    to: string;
};
