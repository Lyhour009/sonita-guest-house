import { router } from '@inertiajs/react';
import { Calendar, CheckCircle2, KeyRound, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import ReservationController from '@/actions/App/Http/Controllers/Staff/ReservationController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from '@/hooks/use-translation';
import type { StaffReservation } from '@/types/reservation';

type Props = {
    reservation: StaffReservation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ReservationCheckinDialog({
    reservation,
    open,
    onOpenChange,
}: Props) {
    const { t } = useTranslation();
    const [keyCard, setKeyCard] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!reservation) return null;

    const handleConfirmCheckin = () => {
        setIsSubmitting(true);
        router.patch(
            ReservationController.checkIn.url(reservation.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    onOpenChange(false);
                    setKeyCard('');
                },
            },
        );
    };

    const dateRange =
        reservation.reservation_type === 'short_stay'
            ? `${reservation.check_in_date} → ${reservation.check_out_date}`
            : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl p-6 sm:max-w-md">
                <DialogHeader className="space-y-1.5">
                    <div className="mb-1 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <LogIn className="size-5.5" />
                    </div>
                    <DialogTitle className="font-sans text-xl font-bold text-foreground">
                        {t('staff.reservations.checkInDialog.title')}
                    </DialogTitle>
                    <DialogDescription className="font-sans text-xs text-muted-foreground">
                        {t('staff.reservations.checkInDialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Guest & Room Summary Box */}
                    <div className="space-y-2.5 rounded-xl border border-border/80 bg-muted/40 p-3.5 font-sans">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <User className="size-3.5" />
                                {t('staff.reservations.checkInDialog.guest')}
                            </span>
                            <span className="font-bold text-foreground">
                                {reservation.guest.full_name}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="size-2 rounded-full bg-primary" />
                                {t('staff.reservations.checkInDialog.room')}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">
                                    #{reservation.room.room_number}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    ({reservation.room.room_type})
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="size-3.5" />
                                {t('staff.reservations.checkInDialog.dates')}
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                                {dateRange}
                            </span>
                        </div>
                    </div>

                    {/* Key Card Field */}
                    <div className="space-y-1.5 font-sans">
                        <Label
                            htmlFor="key-card"
                            className="flex items-center gap-1.5 text-xs font-semibold"
                        >
                            <KeyRound className="size-3.5 text-muted-foreground" />
                            {t(
                                'staff.reservations.checkInDialog.keyCardNumber',
                            )}
                        </Label>
                        <Input
                            id="key-card"
                            value={keyCard}
                            onChange={(e) => setKeyCard(e.target.value)}
                            placeholder={t(
                                'staff.reservations.checkInDialog.keyCardPlaceholder',
                            )}
                            className="h-10 rounded-xl border-border bg-background"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-10 rounded-xl font-sans text-xs px-6"
                    >
                        {t('staff.reservations.checkInDialog.cancelButton')}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirmCheckin}
                        disabled={isSubmitting}
                        className="h-10 cursor-pointer gap-1.5 rounded-xl bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs px-6"
                    >
                        {isSubmitting ? (
                            <Spinner className="size-4" />
                        ) : (
                            <CheckCircle2 className="size-4" />
                        )}
                        {isSubmitting
                            ? t('common.actions.processing')
                            : t(
                                  'staff.reservations.checkInDialog.confirmButton',
                              )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
