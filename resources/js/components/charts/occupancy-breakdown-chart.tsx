import { Cell, Pie, PieChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    short_stay: {
        label: 'Short-stay occupied',
        color: 'var(--chart-1)',
    },
    long_stay: {
        label: 'Long-stay occupied',
        color: 'var(--chart-2)',
    },
    available: {
        label: 'Available',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

export function OccupancyBreakdownChart({
    shortStay,
    longStay,
    available,
}: {
    shortStay: number;
    longStay: number;
    available: number;
}) {
    const chartData = [
        { key: 'short_stay', value: shortStay },
        { key: 'long_stay', value: longStay },
        { key: 'available', value: available },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Room occupancy</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="key" />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="key"
                            innerRadius={55}
                            strokeWidth={4}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.key}
                                    fill={`var(--color-${entry.key})`}
                                />
                            ))}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="key" />}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
