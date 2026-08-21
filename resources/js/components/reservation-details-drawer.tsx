import {
    Calendar,
    Check,
    Clock,
    CreditCard,
    DollarSign,
    Home,
    LogIn,
    LogOut,
    Mail,
    Phone,
    Printer,
    User,
    Users,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useTranslation } from '@/hooks/use-translation';
import type { StaffReservation } from '@/types/reservation';

type Props = {
    reservation: StaffReservation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenCheckin: (reservation: StaffReservation) => void;
    onOpenPrintSlip: (reservation: StaffReservation) => void;
    onAction: (url: string) => void;
    confirmUrl?: (id: string) => string;
    checkOutUrl?: (id: string) => string;
    cancelUrl?: (id: string) => string;
};

export default function ReservationDetailsDrawer({
    reservation,
    open,
    onOpenChange,
    onOpenCheckin,
    onOpenPrintSlip,
    onAction,
    confirmUrl,
    checkOutUrl,
    cancelUrl,
}: Props) {
    const { t } = useTranslation();

    if (!reservation) return null;

    const getInitials = (name: string) => {
        if (!name) return 'G';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const dateRange =
        reservation.reservation_type === 'short_stay'
            ? `${reservation.check_in_date} → ${reservation.check_out_date}`
            : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`;

    const getPaymentBadge = (status?: string) => {
        switch (status) {
            case 'paid':
                return (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-semibold gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {t('staff.reservations.paymentStatus.paid')}
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-sans text-xs font-semibold">
                        {t('staff.reservations.paymentStatus.pending')}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-sans text-xs font-semibold">
                        {t('staff.reservations.paymentStatus.unpaid')}
                    </Badge>
                );
        }
    };

    const getStatusBadge = (resStatus: string) => {
        switch (resStatus) {
            case 'confirmed':
                return (
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-sans text-xs font-semibold">
                        {t('common.reservationStatus.confirmed')}
                    </Badge>
                );
            case 'checked_in':
            case 'active':
                return (
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-semibold gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t(`common.reservationStatus.${resStatus}`)}
                    </Badge>
                );
            case 'checked_out':
                return (
                    <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground font-sans text-xs">
                        {t('common.reservationStatus.checked_out')}
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-sans text-xs">
                        {t('common.reservationStatus.cancelled')}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-sans text-xs font-semibold">
                        {t('common.reservationStatus.pending')}
                    </Badge>
                );
        }
    };

    const totalAmount = reservation.latest_invoice?.total_amount
        ?? (reservation.reservation_type === 'short_stay' ? (reservation.room.price_per_night ?? 0) : (reservation.room.price_per_month ?? 0));

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6 font-sans">
                <SheetHeader className="pb-4 border-b border-border/80">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                            #{reservation.id.substring(0, 8)}
                        </span>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(reservation.status)}
                            {getPaymentBadge(reservation.latest_invoice?.status)}
                        </div>
                    </div>
                    <SheetTitle className="text-xl font-bold font-sans text-foreground">
                        {t('staff.reservations.details.title')}
                    </SheetTitle>
                    <SheetDescription className="text-xs font-sans text-muted-foreground">
                        {t('staff.reservations.details.subtitle')}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 py-4">
                    {/* 1. Guest Profile */}
                    <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <User className="size-3.5" />
                            {t('staff.reservations.details.guestInfo')}
                        </h4>

                        <div className="flex items-center gap-3.5">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
                                {getInitials(reservation.guest.full_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-base font-bold text-foreground">
                                    {reservation.guest.full_name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                    <Mail className="size-3" />
                                    {reservation.guest.email}
                                </p>
                                {reservation.guest.phone_number && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <Phone className="size-3" />
                                        {reservation.guest.phone_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Users className="size-3.5" />
                                {t('staff.reservations.details.guestsCount')}
                            </span>
                            <span className="font-bold text-foreground">
                                {reservation.num_guests ?? 1} persons
                            </span>
                        </div>
                    </div>

                    {/* 2. Room & Stay Details */}
                    <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Home className="size-3.5" />
                            {t('staff.reservations.details.stayInfo')}
                        </h4>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background font-bold text-sm text-foreground shadow-2xs">
                                    #{reservation.room.room_number}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-foreground capitalize">
                                        {t('staff.reservations.details.roomLabel', {
                                            type: reservation.room.room_type,
                                        })}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {t(`staff.reservations.billingCadence.${reservation.reservation_type}`)}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right text-xs">
                                <span className="text-muted-foreground block text-[11px]">
                                    {t('staff.reservations.details.roomRate')}
                                </span>
                                <span className="font-bold text-foreground">
                                    ${reservation.reservation_type === 'short_stay' ? `${reservation.room.price_per_night}/night` : `${reservation.room.price_per_month}/mo`}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Calendar className="size-3.5" />
                                    {t('staff.reservations.table.dates')}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {dateRange}
                                </span>
                            </div>

                            {reservation.created_at && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Clock className="size-3.5" />
                                        {t('staff.reservations.details.createdOn')}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {reservation.created_at}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. Financial & Billing Summary */}
                    <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <CreditCard className="size-3.5" />
                            {t('staff.reservations.details.financialInfo')}
                        </h4>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {t('staff.reservations.details.paymentStatus')}
                                </span>
                                {getPaymentBadge(reservation.latest_invoice?.status)}
                            </div>

                            {reservation.deposit_amount && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t('staff.reservations.details.deposit')}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        ${Number(reservation.deposit_amount).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-sm">
                                <span className="font-bold text-foreground">
                                    {t('staff.reservations.details.totalAmount')}
                                </span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                                    ${Number(totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        {/* Print Registration Slip */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenPrintSlip(reservation);
                            }}
                            className="w-full rounded-xl h-10 gap-2 font-sans text-xs font-semibold border-border bg-card shadow-2xs cursor-pointer"
                        >
                            <Printer className="size-4 text-primary" />
                            {t('staff.reservations.printSlip.printButton')}
                        </Button>

                        {/* Confirm */}
                        {reservation.status === 'pending' && confirmUrl && (
                            <Button
                                type="button"
                                onClick={() => {
                                    onAction(confirmUrl(reservation.id));
                                    onOpenChange(false);
                                }}
                                className="w-full rounded-xl h-10 gap-2 bg-primary text-primary-foreground font-sans text-xs font-semibold shadow-2xs cursor-pointer"
                            >
                                <Check className="size-4" />
                                {t('common.actions.confirm')}
                            </Button>
                        )}

                        {/* Check-in */}
                        {reservation.status === 'confirmed' && reservation.reservation_type === 'short_stay' && (
                            <Button
                                type="button"
                                onClick={() => {
                                    onOpenCheckin(reservation);
                                    onOpenChange(false);
                                }}
                                className="w-full rounded-xl h-10 gap-2 bg-primary text-primary-foreground font-sans text-xs font-semibold shadow-2xs cursor-pointer"
                            >
                                <LogIn className="size-4" />
                                {t('staff.reservations.checkIn')}
                            </Button>
                        )}

                        {/* Check-out */}
                        {reservation.status === 'checked_in' && checkOutUrl && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onAction(checkOutUrl(reservation.id));
                                    onOpenChange(false);
                                }}
                                className="w-full rounded-xl h-10 gap-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-sans text-xs font-semibold hover:bg-emerald-500/20 cursor-pointer"
                            >
                                <LogOut className="size-4" />
                                {t('staff.reservations.checkOut')}
                            </Button>
                        )}

                        {/* Cancel */}
                        {['pending', 'confirmed', 'active'].includes(reservation.status) && cancelUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    onAction(cancelUrl(reservation.id));
                                    onOpenChange(false);
                                }}
                                className="w-full rounded-xl h-9 text-xs text-rose-600 hover:bg-rose-500/10 font-sans cursor-pointer"
                            >
                                <X className="size-3.5 mr-1" />
                                {t('common.actions.cancel')}
                            </Button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
