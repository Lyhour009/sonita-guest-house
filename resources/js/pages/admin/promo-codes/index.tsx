import { Head, router } from '@inertiajs/react';
import { Check, Pencil, Search, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import PromoCodeCreateDialog from '@/components/promo-code-create-dialog';
import PromoCodeEditDialog from '@/components/promo-code-edit-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePendingAction } from '@/hooks/use-pending-action';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import {
    destroy,
    index as adminPromoCodesIndex,
} from '@/routes/admin/promo-codes';
import type { Paginated, PromoCode } from '@/types';

type Filters = {
    search: string | null;
};

type Props = {
    promoCodes: Paginated<PromoCode>;
    filters: Filters;
};

export default function AdminPromoCodesIndex({ promoCodes, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const [editingPromoCodeId, setEditingPromoCodeId] = useState<string | null>(
        null,
    );
    const [isFiltering, setIsFiltering] = useState(false);
    const isFirstRender = useRef(true);

    const editingPromoCode = useMemo(
        () =>
            promoCodes.data.find(
                (promoCode) => promoCode.id === editingPromoCodeId,
            ) ?? null,
        [promoCodes.data, editingPromoCodeId],
    );

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.only?.includes('promoCodes')) {
                setIsFiltering(true);
            }
        });
        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.only?.includes('promoCodes')) {
                setIsFiltering(false);
            }
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const debouncedSearch = useDebouncedValue(search, 300);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        router.get(
            adminPromoCodesIndex().url,
            { search: debouncedSearch || undefined },
            {
                preserveState: true,
                replace: true,
                only: ['promoCodes', 'filters'],
            },
        );
    }, [debouncedSearch]);

    const { isPending, withPending } = usePendingAction();

    const deletePromoCode = (promoCodeId: string) => {
        router.delete(
            destroy(promoCodeId).url,
            withPending(`delete-${promoCodeId}`, {
                preserveScroll: true,
                only: ['promoCodes'],
            }),
        );
    };

    return (
        <>
            <Head title={t('adminPromoCodes.title')} />

            <div className="w-full space-y-5 bg-background p-4 md:p-6">
                <div className="pt-1">
                    <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        {t('adminPromoCodes.title')}
                    </h1>
                    <p className="mt-0.5 font-sans text-sm text-muted-foreground">
                        {t('adminPromoCodes.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-center">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t('adminPromoCodes.searchPlaceholder')}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-10 rounded-2xl border-border bg-background pr-8 pl-9.5 font-sans text-sm shadow-2xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    <PromoCodeCreateDialog />
                </div>

                <div
                    className={cn(
                        'transition-opacity duration-200',
                        isFiltering && 'pointer-events-none opacity-50',
                    )}
                >
                    <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-md">
                        <Table>
                            <TableHeader className="border-b border-border bg-muted/50">
                                <TableRow className="h-13 border-border hover:bg-transparent">
                                    <TableHead className="h-13 py-4 pl-6 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminPromoCodes.table.code')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminPromoCodes.table.discount')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminPromoCodes.table.usage')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminPromoCodes.table.expires')}
                                    </TableHead>
                                    <TableHead className="h-13 px-4 py-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('adminPromoCodes.table.status')}
                                    </TableHead>
                                    <TableHead className="h-13 py-4 pr-6 text-right font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        {t('common.actions.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/60">
                                {promoCodes.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-24 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="flex size-16 items-center justify-center rounded-3xl bg-muted shadow-inner">
                                                    <Tag className="size-8 text-muted-foreground opacity-50" />
                                                </div>
                                                <p className="font-sans text-sm font-bold text-foreground">
                                                    {t('adminPromoCodes.empty')}
                                                </p>
                                                <p className="max-w-sm font-sans text-sm text-muted-foreground">
                                                    {t(
                                                        'adminPromoCodes.emptyDescription',
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    promoCodes.data.map((promoCode) => (
                                        <TableRow
                                            key={promoCode.id}
                                            className="h-16 transition-all duration-300 hover:bg-primary/5"
                                        >
                                            <TableCell className="py-3.5 pl-6 font-sans text-sm font-bold text-foreground">
                                                {promoCode.code}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {promoCode.discount_type ===
                                                'percent'
                                                    ? `${promoCode.discount_value}%`
                                                    : `$${promoCode.discount_value}`}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-foreground">
                                                {promoCode.used_count}
                                                {promoCode.max_uses !== null
                                                    ? ` / ${promoCode.max_uses}`
                                                    : ''}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-sans text-sm text-muted-foreground">
                                                {promoCode.expires_at ??
                                                    t(
                                                        'adminPromoCodes.noExpiry',
                                                    )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                {promoCode.active ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-emerald-500/40 bg-emerald-500/10 font-sans text-xs text-emerald-700 dark:text-emerald-300"
                                                    >
                                                        <Check className="size-3" />
                                                        {t(
                                                            'adminPromoCodes.active',
                                                        )}
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-border bg-muted/50 font-sans text-xs text-muted-foreground"
                                                    >
                                                        {t(
                                                            'adminPromoCodes.inactive',
                                                        )}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-3.5 pr-6 text-right">
                                                <div className="flex justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 rounded-full font-sans text-xs font-semibold"
                                                        onClick={() =>
                                                            setEditingPromoCodeId(
                                                                promoCode.id,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="size-3.5" />
                                                        {t(
                                                            'common.actions.edit',
                                                        )}
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="h-8 rounded-full font-sans text-xs font-semibold"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                                {t(
                                                                    'common.actions.delete',
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    {t(
                                                                        'adminPromoCodes.deletePromoCode.title',
                                                                        {
                                                                            code: promoCode.code,
                                                                        },
                                                                    )}
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t(
                                                                        'adminPromoCodes.deletePromoCode.description',
                                                                    )}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    <X className="mr-2 size-4" />
                                                                    {t(
                                                                        'common.actions.cancel',
                                                                    )}
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    variant="destructive"
                                                                    disabled={isPending(
                                                                        `delete-${promoCode.id}`,
                                                                    )}
                                                                    onClick={() =>
                                                                        deletePromoCode(
                                                                            promoCode.id,
                                                                        )
                                                                    }
                                                                >
                                                                    {isPending(
                                                                        `delete-${promoCode.id}`,
                                                                    ) ? (
                                                                        <Spinner className="mr-2" />
                                                                    ) : (
                                                                        <Trash2 className="mr-2 size-4" />
                                                                    )}
                                                                    {t(
                                                                        'common.actions.delete',
                                                                    )}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="font-sans text-xs text-muted-foreground">
                        {t('adminPromoCodes.showingCount', {
                            shown: promoCodes.data.length,
                            total: promoCodes.total,
                        })}
                    </p>
                    <Pagination meta={promoCodes} />
                </div>
            </div>

            <PromoCodeEditDialog
                promoCode={editingPromoCode}
                onOpenChange={(open) => !open && setEditingPromoCodeId(null)}
            />
        </>
    );
}

AdminPromoCodesIndex.layout = {
    breadcrumbs: [{ title: 'Promo Codes', href: adminPromoCodesIndex() }],
};
