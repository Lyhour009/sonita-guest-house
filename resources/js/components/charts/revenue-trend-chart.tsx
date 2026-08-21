import { TrendingUp, DollarSign } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import type { RevenueTrendPoint } from '@/types';

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
    const { t } = useTranslation();
    const total14Days = data.reduce((acc, curr) => acc + curr.amount, 0);
    const avgDaily = total14Days / (data.length || 1);

    const chartData = data.map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    }));

    return (
        <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
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
            <CardContent className="pt-2">
                <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
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
                                            <div className="rounded-xl border border-border/80 bg-popover p-2.5 shadow-lg backdrop-blur-md">
                                                <p className="text-xs font-medium text-muted-foreground">{point.label}</p>
                                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
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
                                stroke="#10b981"
                                strokeWidth={2.5}
                                fill="url(#revenueGrad)"
                                activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
