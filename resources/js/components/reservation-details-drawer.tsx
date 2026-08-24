import { useForm, router } from '@inertiajs/react';
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
    Plus,
    Printer,
    Save,
    Trash2,
    User,
    Users,
    X,
    ConciergeBell,
    Phone,
    Repeat2,
    StickyNote,
} from 'lucide-react';
import { useEffect } from 'react';
import {
    ReservationStatusBadge,
    PaymentStatusBadge,
} from '@/components/reservation-badges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { getInitials } from '@/lib/utils';
import { update as updateNotes } from '@/routes/staff/reservations/notes';
import {
    store as storeService,
    destroy as destroyService,
} from '@/routes/staff/reservations/services';
import type { StaffReservation } from '@/types/reservation';

type Props = {
    available_services?: { id: string; name: string; price: number }[];
    reservation: StaffReservation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenCheckin: (reservation: StaffReservation) => void;
    onOpenPrintSlip: (reservation: StaffReservation) => void;
    onAction: (id: string, url: string) => void;
    confirmUrl?: (id: string) => string;
    checkOutUrl?: (id: string) => string;
    cancelUrl?: (id: string) => string;
};

export default function ReservationDetailsDrawer({
    available_services = [],
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

    const addServiceForm = useForm({
        service_id: '',
        quantity: 1,
    });

    const notesForm = useForm({
        notes: reservation?.notes ?? '',
    });

    useEffect(() => {
        notesForm.setData('notes', reservation?.notes ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reservation?.id]);

    if (!reservation) {
        return null;
    }

    const dateRange =
        reservation.reservation_type === 'short_stay'
            ? `${reservation.check_in_date} → ${reservation.check_out_date}`
            : `${reservation.start_date} → ${reservation.end_date ?? t('staff.reservations.openEnded')}`;

    const totalAmount = reservation.total_amount ?? 0;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto p-6 font-sans sm:max-w-lg">
                <SheetHeader className="border-b border-border/80 pb-4">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-muted-foreground uppercase">
                            #{reservation.id.substring(0, 8)}
                        </span>
                        <div className="flex items-center gap-2">
                            <ReservationStatusBadge
                                status={reservation.status}
                            />
                            <PaymentStatusBadge
                                status={reservation.latest_invoice?.status}
                            />
                        </div>
                    </div>
                    <SheetTitle className="font-sans text-xl font-bold text-foreground">
                        {t('staff.reservations.details.title')}
                    </SheetTitle>
                    <SheetDescription className="font-sans text-xs text-muted-foreground">
                        {t('staff.reservations.details.subtitle')}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 py-4">
                    {/* 1. Guest Profile */}
                    <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <User className="size-3.5" />
                            {t('staff.reservations.details.guestInfo')}
                        </h4>

                        <div className="flex items-center gap-3.5">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                                {getInitials(reservation.guest.full_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-base font-bold text-foreground">
                                    <span className="truncate">
                                        {reservation.guest.full_name}
                                    </span>
                                    {(reservation.guest.completed_stays_count ??
                                        0) > 1 && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1 border-primary/40 bg-primary/10 text-[10px] font-semibold text-primary"
                                        >
                                            <Repeat2 className="size-3" />
                                            {t(
                                                'staff.reservations.details.returningGuest',
                                                {
                                                    count: reservation.guest
                                                        .completed_stays_count!,
                                                },
                                            )}
                                        </Badge>
                                    )}
                                </p>
                                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Mail className="size-3" />
                                    {reservation.guest.email}
                                </p>
                                {reservation.guest.phone_number && (
                                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Phone className="size-3" />
                                        {reservation.guest.phone_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="size-3.5" />
                                {t('staff.reservations.details.guestsCount')}
                            </span>
                            <span className="font-bold text-foreground">
                                {reservation.num_guests ?? 1} persons
                            </span>
                        </div>
                    </div>

                    {/* 2. Room & Stay Details */}
                    <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <Home className="size-3.5" />
                            {t('staff.reservations.details.stayInfo')}
                        </h4>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-sm font-bold text-foreground shadow-2xs">
                                    #{reservation.room.room_number}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-foreground capitalize">
                                        {t(
                                            'staff.reservations.details.roomLabel',
                                            {
                                                type: reservation.room
                                                    .room_type,
                                            },
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                        {t(
                                            `staff.reservations.billingCadence.${reservation.reservation_type}`,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right text-xs">
                                <span className="block text-[11px] text-muted-foreground">
                                    {t('staff.reservations.details.roomRate')}
                                </span>
                                <span className="font-bold text-foreground">
                                    $
                                    {reservation.reservation_type ===
                                    'short_stay'
                                        ? `${reservation.room.price_per_night}/night`
                                        : `${reservation.room.price_per_month}/mo`}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-border/60 pt-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="size-3.5" />
                                    {t('staff.reservations.table.dates')}
                                </span>
                                <span className="font-semibold text-foreground">
                                    {dateRange}
                                </span>
                            </div>

                            {reservation.created_at && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        {t(
                                            'staff.reservations.details.createdOn',
                                        )}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {reservation.created_at}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Staff Notes */}
                    <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <StickyNote className="size-3.5" />
                            {t('staff.reservations.details.notes.title')}
                        </h4>

                        <form
                            className="space-y-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                notesForm.patch(
                                    updateNotes(reservation.id).url,
                                    {
                                        preserveScroll: true,
                                    },
                                );
                            }}
                        >
                            <Textarea
                                value={notesForm.data.notes}
                                onChange={(e) =>
                                    notesForm.setData('notes', e.target.value)
                                }
                                placeholder={t(
                                    'staff.reservations.details.notes.placeholder',
                                )}
                                className="min-h-20 text-xs"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    !notesForm.isDirty || notesForm.processing
                                }
                                className="h-8 gap-1.5 rounded-lg bg-primary/10 font-sans text-xs font-semibold text-primary hover:bg-primary/20"
                            >
                                {notesForm.processing ? (
                                    <Spinner className="size-3" />
                                ) : (
                                    <Save className="size-3" />
                                )}
                                {t('staff.reservations.details.notes.save')}
                            </Button>
                        </form>
                    </div>

                    {/* 3. Financial & Billing Summary */}
                    <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                        <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                            <CreditCard className="size-3.5" />
                            {t('staff.reservations.details.financialInfo')}
                        </h4>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {t(
                                        'staff.reservations.details.paymentStatus',
                                    )}
                                </span>
                                <PaymentStatusBadge
                                    status={reservation.latest_invoice?.status}
                                />
                            </div>

                            {reservation.deposit_amount && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'staff.reservations.details.deposit',
                                        )}
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        $
                                        {Number(
                                            reservation.deposit_amount,
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {reservation.latest_invoice ? (
                                <>
                                    <div className="flex items-center justify-between border-t border-border/60 pt-2">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <DollarSign className="size-3" />
                                            {t(
                                                'staff.reservations.details.roomCharge',
                                            )}
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            $
                                            {Number(
                                                reservation.latest_invoice
                                                    .room_charge ?? 0,
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {(reservation.latest_invoice
                                        .service_charge ?? 0) > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                {t(
                                                    'staff.reservations.details.serviceCharge',
                                                )}
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                $
                                                {Number(
                                                    reservation.latest_invoice
                                                        .service_charge,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    {(reservation.latest_invoice.tax_amount ??
                                        0) > 0 && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                {t(
                                                    'staff.reservations.details.taxAmount',
                                                )}
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                $
                                                {Number(
                                                    reservation.latest_invoice
                                                        .tax_amount,
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between border-t border-border/60 pt-2 text-sm">
                                        <span className="font-bold text-foreground">
                                            {t(
                                                'staff.reservations.details.totalAmount',
                                            )}
                                        </span>
                                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                                            $
                                            {Number(
                                                reservation.latest_invoice
                                                    .total_amount,
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    {reservation.latest_invoice.due_date && (
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {t(
                                                    'staff.reservations.details.dueDate',
                                                )}
                                            </span>
                                            <span>
                                                {
                                                    reservation.latest_invoice
                                                        .due_date
                                                }
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-between border-t border-border/60 pt-2 text-sm">
                                    <span className="font-bold text-foreground">
                                        {t(
                                            'staff.reservations.details.totalAmount',
                                        )}
                                    </span>
                                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                                        ${Number(totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Services Section */}
                    {reservation.status !== 'pending' &&
                        reservation.status !== 'cancelled' && (
                            <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
                                <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    <ConciergeBell className="size-3.5" />
                                    {t(
                                        'staff.reservations.details.extraServices',
                                    ) || 'Extra Services'}
                                </h4>

                                {reservation.services &&
                                    reservation.services.length > 0 && (
                                        <div className="space-y-2">
                                            {reservation.services.map(
                                                (service, index) => (
                                                    <div
                                                        key={
                                                            service.pivot_id ||
                                                            index
                                                        }
                                                        className="flex items-center justify-between text-xs"
                                                    >
                                                        <div>
                                                            <span className="font-semibold text-foreground">
                                                                {service.name}
                                                            </span>
                                                            <span className="ml-1 text-muted-foreground">
                                                                x
                                                                {
                                                                    service.quantity
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                                $
                                                                {(
                                                                    service.unit_price *
                                                                    service.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-6 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            'Are you sure you want to remove this service?',
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            destroyService(
                                                                                {
                                                                                    reservation:
                                                                                        reservation.id,
                                                                                    service:
                                                                                        service.id,
                                                                                },
                                                                            )
                                                                                .url,
                                                                            {
                                                                                preserveScroll: true,
                                                                            },
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="size-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}

                                {available_services.length > 0 && (
                                    <form
                                        className="flex items-start gap-2 border-t border-border/60 pt-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            addServiceForm.post(
                                                storeService(reservation.id)
                                                    .url,
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        addServiceForm.reset();
                                                    },
                                                },
                                            );
                                        }}
                                    >
                                        <div className="flex-1">
                                            <Select
                                                value={
                                                    addServiceForm.data
                                                        .service_id
                                                }
                                                onValueChange={(val) =>
                                                    addServiceForm.setData(
                                                        'service_id',
                                                        val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue placeholder="Select service..." />
                                                </SelectTrigger>
                                                <SelectContent portaled={false}>
                                                    {available_services.map(
                                                        (s) => (
                                                            <SelectItem
                                                                key={s.id}
                                                                value={s.id}
                                                                className="text-xs"
                                                            >
                                                                {s.name} ($
                                                                {Number(
                                                                    s.price,
                                                                ).toFixed(2)}
                                                                )
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-16">
                                            <Input
                                                type="number"
                                                min={1}
                                                value={
                                                    addServiceForm.data.quantity
                                                }
                                                onChange={(e) =>
                                                    addServiceForm.setData(
                                                        'quantity',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 1,
                                                    )
                                                }
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={
                                                !addServiceForm.data
                                                    .service_id ||
                                                addServiceForm.processing
                                            }
                                            className="h-8 shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                                        >
                                            {addServiceForm.processing ? (
                                                <Spinner className="size-3" />
                                            ) : (
                                                <Plus className="size-3" />
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        )}

                    {/* 4. Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                        {/* Print Registration Slip */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenPrintSlip(reservation);
                            }}
                            className="h-10 w-full cursor-pointer gap-2 rounded-xl border-border bg-card font-sans text-xs font-semibold shadow-2xs"
                        >
                            <Printer className="size-4 text-primary" />
                            {t('staff.reservations.printSlip.printButton')}
                        </Button>

                        {/* Confirm */}
                        {reservation.status === 'pending' && confirmUrl && (
                            <Button
                                type="button"
                                onClick={() => {
                                    onAction(
                                        reservation.id,
                                        confirmUrl(reservation.id),
                                    );
                                    onOpenChange(false);
                                }}
                                className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs"
                            >
                                <Check className="size-4" />
                                {t('common.actions.confirm')}
                            </Button>
                        )}

                        {/* Check-in */}
                        {reservation.status === 'confirmed' &&
                            reservation.reservation_type === 'short_stay' && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        onOpenCheckin(reservation);
                                        onOpenChange(false);
                                    }}
                                    className="h-10 w-full cursor-pointer gap-2 rounded-xl bg-primary font-sans text-xs font-semibold text-primary-foreground shadow-2xs"
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
                                    onAction(
                                        reservation.id,
                                        checkOutUrl(reservation.id),
                                    );
                                    onOpenChange(false);
                                }}
                                className="h-10 w-full cursor-pointer gap-2 rounded-xl border-emerald-500/40 bg-emerald-500/10 font-sans text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                            >
                                <LogOut className="size-4" />
                                {t('staff.reservations.checkOut')}
                            </Button>
                        )}

                        {/* Cancel */}
                        {['pending', 'confirmed', 'active'].includes(
                            reservation.status,
                        ) &&
                            cancelUrl && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        onAction(
                                            reservation.id,
                                            cancelUrl(reservation.id),
                                        );
                                        onOpenChange(false);
                                    }}
                                    className="h-9 w-full cursor-pointer rounded-xl font-sans text-xs text-rose-600 hover:bg-rose-500/10"
                                >
                                    <X className="mr-1 size-3.5" />
                                    {t('common.actions.cancel')}
                                </Button>
                            )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
