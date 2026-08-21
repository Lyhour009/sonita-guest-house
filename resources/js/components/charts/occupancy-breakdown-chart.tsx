import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

export function OccupancyBreakdownChart({
    shortStay,
    longStay,
    available,
}: {
    shortStay: number;
    longStay: number;
    available: number;
}) {
    const { t } = useTranslation();
    const total = shortStay + longStay + available;
    const occupiedTotal = shortStay + longStay;
    const occupancyRate = total > 0 ? Math.round((occupiedTotal / total) * 100) : 0;

    const data = [
        { name: t('adminDashboard.occupancyChart.shortStayLegend'), value: shortStay, color: 'var(--chart-short-stay)' },
        { name: t('adminDashboard.occupancyChart.longStayLegend'), value: longStay, color: 'var(--chart-long-stay)' },
        { name: t('adminDashboard.occupancyChart.availableLegend'), value: available, color: 'var(--chart-available)' },
    ].filter((item) => item.value > 0);

    const fallbackData = data.length > 0 ? data : [{ name: 'Empty', value: 1, color: 'var(--muted)' }];

    return (
        <Card className="rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold tracking-tight font-sans">
                        {t('adminDashboard.occupancyChart.title')}
                    </CardTitle>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        {occupancyRate}%
                    </span>
                </div>
                <CardDescription className="text-xs text-muted-foreground font-sans">
                    {occupiedTotal} / {total} {t('adminDashboard.stats.totalRooms').toLowerCase()}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="relative h-[180px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const item = payload[0].payload;
                                        return (
                                            <div className="rounded-xl border border-border bg-popover p-2.5 shadow-lg">
                                                <p className="text-xs font-medium text-muted-foreground">{item.name}</p>
                                                <p className="text-sm font-bold text-foreground">{item.value} rooms</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Pie
                                data={fallbackData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={52}
                                outerRadius={75}
                                paddingAngle={3}
                                stroke="none"
                            >
                                {fallbackData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Donut Label */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold tracking-tight text-foreground font-sans">
                            {occupancyRate}%
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {t('adminDashboard.stats.occupancyRate')}
                        </span>
                    </div>
                </div>

                {/* Clean Custom Legends referencing app.css tokens */}
                <div className="mt-2 space-y-1.5 border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-chart-short-stay" />
                            <span className="text-muted-foreground">{t('adminDashboard.occupancyChart.shortStayLegend')}</span>
                        </div>
                        <span className="font-semibold">{shortStay}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-chart-long-stay" />
                            <span className="text-muted-foreground">{t('adminDashboard.occupancyChart.longStayLegend')}</span>
                        </div>
                        <span className="font-semibold">{longStay}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full bg-chart-available" />
                            <span className="text-muted-foreground">{t('adminDashboard.occupancyChart.availableLegend')}</span>
                        </div>
                        <span className="font-semibold text-success">{available}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
