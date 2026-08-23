import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { RevenueTrendPoint } from '@/types';

export function RevenueTrendChart({
    data,
    revenueTrend,
}: {
    data?: RevenueTrendPoint[];
    revenueTrend?: RevenueTrendPoint[];
}) {
    const { t } = useTranslation();
    const points = data ?? revenueTrend ?? [];
    const total14Days = points.reduce((acc, curr) => acc + curr.amount, 0);
    const avgDaily = total14Days / (points.length || 1);

    const chartData = points.map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    }));

    return (
        <Card className="rounded-3xl border border-border/50 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-border/50">
                <div>
                    <CardTitle className="text-base font-bold tracking-tight font-sans">
                        {t('adminDashboard.revenueChart.title')}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground font-sans mt-0.5">
                        {t('adminDashboard.revenueChart.totalEarned')}: <span className="font-semibold text-foreground">${total14Days.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> · {t('adminDashboard.revenueChart.dailyAverage')}: <span className="font-semibold text-foreground">${avgDaily.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="size-3.5" />
                    <span>${total14Days.toFixed(0)}</span>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={20}
                                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val}`}
                                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const point = payload[0].payload as RevenueTrendPoint & { label: string };
                                        return (
                                            <div className="rounded-xl border border-border bg-popover p-2.5 shadow-lg">
                                                <p className="text-xs font-medium text-muted-foreground font-sans">{point.label}</p>
                                                <p className="text-sm font-bold text-primary font-sans">
                                                    ${Number(point.amount).toFixed(2)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="var(--chart-revenue)"
                                strokeWidth={2.5}
                                fill="var(--chart-revenue)"
                                fillOpacity={0.12}
                                activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--chart-revenue)' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export default RevenueTrendChart;
