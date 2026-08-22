import { Check, Hotel, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import type { StaffReservation } from '@/types/reservation';

type Props = {
    reservation: StaffReservation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ReservationPrintSlip({
    reservation,
    open,
    onOpenChange,
}: Props) {
    const { t } = useTranslation();

    if (!reservation) return null;

    const handlePrint = () => {
        window.print();
    };

    const dateRange =
        reservation.reservation_type === 'short_stay'
            ? `${reservation.check_in_date} → ${reservation.check_out_date}`
            : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`;

    const totalAmount = reservation.latest_invoice?.total_amount ?? reservation.total_amount ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 print:p-0 print:border-none print:shadow-none">
                <DialogHeader className="print:hidden">
                    <DialogTitle className="text-lg font-bold font-sans text-foreground flex items-center gap-2">
                        <Printer className="size-5 text-primary" />
                        {t('staff.reservations.printSlip.title')}
                    </DialogTitle>
                </DialogHeader>

                {/* Printable Slip Container */}
                <div id="printable-guest-slip" className="border border-border/80 rounded-xl p-6 bg-card text-foreground font-sans space-y-6 print:border-none print:p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-border/80 pb-5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Hotel className="size-4.5" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">
                                    {t('staff.reservations.printSlip.guestHouseName')}
                                </h2>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('staff.reservations.printSlip.guestHouseAddress')}
                            </p>
                        </div>

                        <div className="text-right space-y-1">
                            <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-bold">
                                #{reservation.id.substring(0, 8).toUpperCase()}
                            </span>
                            <p className="text-[11px] text-muted-foreground">
                                {t('staff.reservations.printSlip.dateIssued')}: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Guest & Stay Matrix */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
                            <div>
                                <span className="text-muted-foreground block text-[11px] font-medium">
                                    {t('staff.reservations.printSlip.guestName')}
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    {reservation.guest.full_name}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-[11px] font-medium">
                                    {t('staff.reservations.details.email')}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {reservation.guest.email}
                                </span>
                            </div>
                            {reservation.guest.phone_number && (
                                <div>
                                    <span className="text-muted-foreground block text-[11px] font-medium">
                                        {t('staff.reservations.details.phone')}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {reservation.guest.phone_number}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-muted-foreground block text-[11px] font-medium">
                                        {t('staff.reservations.printSlip.roomNumber')}
                                    </span>
                                    <span className="text-sm font-bold text-foreground">
                                        #{reservation.room.room_number}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-muted-foreground block text-[11px] font-medium">
                                        {t('staff.reservations.printSlip.roomType')}
                                    </span>
                                    <span className="font-semibold capitalize text-foreground">
                                        {reservation.room.room_type}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-muted-foreground block text-[11px] font-medium">
                                    {t('staff.reservations.printSlip.stayDates')}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {dateRange}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-border/40">
                                <span className="text-muted-foreground text-[11px] font-medium">
                                    {t('staff.reservations.printSlip.totalDue')}:
                                </span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                    ${Number(totalAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-2 rounded-lg bg-muted/30 p-3.5 text-[11px] text-muted-foreground">
                        <h4 className="font-bold text-foreground text-xs">
                            {t('staff.reservations.printSlip.termsTitle')}
                        </h4>
                        <p>{t('staff.reservations.printSlip.terms1')}</p>
                        <p>{t('staff.reservations.printSlip.terms2')}</p>
                        <p>{t('staff.reservations.printSlip.terms3')}</p>
                    </div>

                    {/* Signatures */}
                    <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
                        <div className="space-y-12">
                            <div className="border-b border-border/80 w-3/4 mx-auto" />
                            <p className="font-bold text-foreground">
                                {t('staff.reservations.printSlip.guestSignature')}
                            </p>
                        </div>
                        <div className="space-y-12">
                            <div className="border-b border-border/80 w-3/4 mx-auto" />
                            <p className="font-bold text-foreground">
                                {t('staff.reservations.printSlip.frontDeskSignature')}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-3 pt-3 print:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl font-sans text-xs h-10 px-8"
                    >
                        {t('staff.reservations.printSlip.closeButton')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handlePrint}
                        className="rounded-xl font-sans text-xs font-semibold h-10 gap-2 px-8 bg-primary text-primary-foreground shadow-2xs cursor-pointer"
                    >
                        <Printer className="size-4" />
                        {t('staff.reservations.printSlip.printButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
