import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import type { RevenueTrendPoint } from '@/types';

const chartConfig = {
    amount: {
        label: 'Revenue',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

export function RevenueTrendChart({ data }: { data: RevenueTrendPoint[] }) {
    const chartData = data.map((point) => ({
        ...point,
        label: new Date(point.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue — last 14 days</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full">
                    <AreaChart
                        data={chartData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={24}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => [
                                        `$${Number(value).toFixed(2)}`,
                                        ' Revenue',
                                    ]}
                                />
                            }
                        />
                        <defs>
                            <linearGradient
                                id="revenueFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-amount)"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-amount)"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="amount"
                            type="monotone"
                            fill="url(#revenueFill)"
                            stroke="var(--color-amount)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
