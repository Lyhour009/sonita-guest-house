import type { Dictionary } from '../translate';
import { adminActivityLog } from './adminActivityLog';
import { adminDashboard } from './adminDashboard';
import { adminInvoices } from './adminInvoices';
import { adminPromoCodes } from './adminPromoCodes';
import { adminReports } from './adminReports';
import { adminRooms } from './adminRooms';
import { adminWaitlist } from './adminWaitlist';
import { auth } from './auth';
import { common } from './common';
import { dashboard } from './dashboard';
import { invoices } from './invoices';
import { maintenance } from './maintenance';
import { nav } from './nav';
import { notifications } from './notifications';
import { payments } from './payments';
import { reservations } from './reservations';
import { rooms } from './rooms';
import { services } from './services';
import { settingsPage } from './settingsPage';
import { staff } from './staff';
import { staffAccounts } from './staffAccounts';
import { toasts } from './toasts';
import { welcome } from './welcome';

export const km: Dictionary = {
    common,
    nav,
    auth,
    welcome,
    rooms,
    dashboard,
    reservations,
    invoices,
    payments,
    maintenance,
    notifications,
    settingsPage,
    services,
    staffAccounts,
    adminActivityLog,
    adminDashboard,
    adminInvoices,
    adminPromoCodes,
    adminReports,
    adminRooms,
    adminWaitlist,
    staff,
    toasts,
};
