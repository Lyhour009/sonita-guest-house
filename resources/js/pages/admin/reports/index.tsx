import { Head, router } from '@inertiajs/react';
import { Clock, DollarSign, Download, FileText, Wrench } from 'lucide-react';
import { useState } from 'react';
import RevenueTrendChart from '@/components/charts/revenue-trend-chart';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { index as adminReportsIndex } from '@/routes/admin/reports';
import { csv, pdf } from '@/routes/admin/reports/export';
import type { AdminReport, ReportFilters } from '@/types';

type Props = {
    report: AdminReport;
    filters: ReportFilters;
};

export default function AdminReportsIndex({ report, filters }: Props) {
    const { t } = useTranslation();
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const applyRange = () => {
        router.get(
            adminReportsIndex().url,
            { from, to },
            { preserveState: true, preserveScroll: true },
        );
    };

    const exportQuery = { query: { from, to } };

    return (
        <>
            <Head title={t('adminReports.title')} />

            <div className="space-y-8 p-6 lg:p-10">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-sans text-3xl font-bold tracking-tight">
                            {t('adminReports.title')}
                        </h1>
                        <p className="mt-1 font-sans text-sm text-muted-foreground">
                            {t('adminReports.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-border/50 bg-card/60 p-3 shadow-sm backdrop-blur-md sm:flex-row sm:items-end">
                    <div className="grid gap-1.5">
                        <Label htmlFor="report_from" className="text-[13px]">
                            {t('adminReports.fromLabel')}
                        </Label>
                        <DatePicker
                            id="report_from"
                            value={from}
                            onChange={setFrom}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="report_to" className="text-[13px]">
                            {t('adminReports.toLabel')}
                        </Label>
                        <DatePicker
                            id="report_to"
                            value={to}
                            onChange={setTo}
                        />
                    </div>
                    <Button
                        type="button"
                        onClick={applyRange}
                        className="h-10 rounded-2xl font-sans text-sm font-semibold"
                    >
                        {t('adminReports.apply')}
                    </Button>

                    <div className="flex flex-1 items-center justify-end gap-2.5">
                        <Button
                            asChild
                            variant="outline"
                            className="h-10 gap-1.5 rounded-2xl font-sans text-sm shadow-2xs"
                        >
                            <a href={csv.url(exportQuery)}>
                                <Download className="size-4" />
                                {t('adminReports.exportCsv')}
                            </a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-10 gap-1.5 rounded-2xl font-sans text-sm shadow-2xs"
                        >
                            <a href={pdf.url(exportQuery)}>
                                <FileText className="size-4" />
                                {t('adminReports.exportPdf')}
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.revenue')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            $
                            {report.revenue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.reservationsCreated')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {report.reservationsCreatedCount}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.outstandingInvoices')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <FileText className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {report.outstandingInvoicesCount}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.maintenanceResolved')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Wrench className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {report.maintenanceResolvedCount}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.maintenanceNew')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <Wrench className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {report.maintenanceNewCount}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-sans text-sm font-medium text-muted-foreground">
                                {t('adminReports.stats.avgResolutionTime')}
                            </span>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Clock className="size-4.5" />
                            </div>
                        </div>
                        <div className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {report.maintenanceAvgResolutionHours !== null
                                ? `${report.maintenanceAvgResolutionHours} ${t('adminReports.stats.hoursSuffix')}`
                                : t('adminReports.stats.notAvailable')}
                        </div>
                    </div>
                </div>

                <RevenueTrendChart
                    data={report.revenueByDay}
                    title={t('adminReports.chart.title')}
                    totalLabel={t('adminReports.chart.totalEarned')}
                    avgLabel={t('adminReports.chart.dailyAverage')}
                />
            </div>
        </>
    );
}

AdminReportsIndex.layout = {
    breadcrumbs: [{ title: 'Reports', href: adminReportsIndex() }],
};
