import { CheckCircle2, DollarSign, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';

export type CheckoutInvoiceSummary = {
    id: string;
    room_number: string;
    guest_name: string;
    room_charge: number;
    service_charge: number;
    tax_amount: number;
    total_amount: number;
    due_date?: string | null;
};

type Props = {
    invoice: CheckoutInvoiceSummary | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceUrl?: string;
};

export default function ReservationCheckoutInvoiceDialog({
    invoice,
    open,
    onOpenChange,
    invoiceUrl,
}: Props) {
    const { t } = useTranslation();

    if (!invoice) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-sans sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle2 className="size-7 text-emerald-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                        {t('staff.reservations.checkoutInvoice.title')}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {t('staff.reservations.checkoutInvoice.subtitle')}
                    </DialogDescription>
                </DialogHeader>

                {/* Guest & Room info */}
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-sm">
                    <div>
                        <p className="font-bold text-foreground">
                            {invoice.guest_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Room #{invoice.room_number}
                        </p>
                    </div>
                    {invoice.due_date && (
                        <div className="text-right text-xs text-muted-foreground">
                            <p>{t('staff.reservations.details.dueDate')}</p>
                            <p className="font-semibold text-foreground">
                                {invoice.due_date}
                            </p>
                        </div>
                    )}
                </div>

                {/* Invoice Breakdown */}
                <div className="space-y-2.5 rounded-xl border border-border/80 bg-card p-4 text-sm">
                    <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        <DollarSign className="size-3.5" />
                        Invoice Breakdown
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                {t(
                                    'staff.reservations.checkoutInvoice.roomCharge',
                                )}
                            </span>
                            <span className="font-semibold text-foreground">
                                ${Number(invoice.room_charge).toFixed(2)}
                            </span>
                        </div>

                        {invoice.service_charge > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {t(
                                        'staff.reservations.checkoutInvoice.serviceCharge',
                                    )}
                                </span>
                                <span className="font-semibold text-foreground">
                                    ${Number(invoice.service_charge).toFixed(2)}
                                </span>
                            </div>
                        )}

                        {invoice.tax_amount > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    {t(
                                        'staff.reservations.checkoutInvoice.taxAmount',
                                    )}
                                </span>
                                <span className="font-semibold text-foreground">
                                    ${Number(invoice.tax_amount).toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <Separator className="my-1" />

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">
                            {t('staff.reservations.checkoutInvoice.total')}
                        </span>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                            ${Number(invoice.total_amount).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-1">
                    <Button
                        variant="outline"
                        className="h-10 flex-1 rounded-xl font-sans text-sm font-semibold"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="size-4" />
                        {t('staff.reservations.checkoutInvoice.close')}
                    </Button>

                    {invoiceUrl && (
                        <Button
                            className="h-10 flex-1 rounded-xl font-sans text-sm font-semibold"
                            onClick={() => {
                                window.open(invoiceUrl, '_blank');
                                onOpenChange(false);
                            }}
                        >
                            <ExternalLink className="size-4" />
                            {t(
                                'staff.reservations.checkoutInvoice.viewInvoice',
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
