<?php

namespace App\Actions\Reports;

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Payment;
use App\Models\Reservation;
use Carbon\CarbonInterface;

class BuildAdminReport
{
    /**
     * Build a revenue / occupancy / maintenance snapshot for an admin-chosen date range.
     *
     * @return array<string, mixed>
     */
    public function handle(CarbonInterface $from, CarbonInterface $to): array
    {
        $revenue = (float) Payment::query()
            ->where('status', 'confirmed')
            ->whereBetween('paid_at', [$from, $to])
            ->sum('amount');

        $reservationsCreatedCount = Reservation::query()
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $maintenanceResolvedCount = MaintenanceRequest::query()
            ->where('status', 'resolved')
            ->whereBetween('resolved_at', [$from, $to])
            ->count();

        $maintenanceNewCount = MaintenanceRequest::query()
            ->whereBetween('created_at', [$from, $to])
            ->count();

        $avgResolutionHours = MaintenanceRequest::query()
            ->where('status', 'resolved')
            ->whereBetween('resolved_at', [$from, $to])
            ->whereNotNull('resolved_at')
            ->get(['created_at', 'resolved_at'])
            ->avg(fn (MaintenanceRequest $request) => $request->created_at->diffInHours($request->resolved_at));

        return [
            'revenue' => $revenue,
            'revenueByDay' => $this->revenueByDay($from, $to),
            'reservationsCreatedCount' => $reservationsCreatedCount,
            'outstandingInvoicesCount' => Invoice::query()->whereIn('status', ['unpaid', 'partial'])->count(),
            'maintenanceResolvedCount' => $maintenanceResolvedCount,
            'maintenanceNewCount' => $maintenanceNewCount,
            'maintenanceAvgResolutionHours' => $avgResolutionHours !== null ? round($avgResolutionHours, 1) : null,
        ];
    }

    /**
     * Confirmed payment revenue for each day in the range, including days with no revenue.
     * Capped to 90 days so the response and any chart stay reasonably sized.
     *
     * @return array<int, array{date: string, amount: float}>
     */
    private function revenueByDay(CarbonInterface $from, CarbonInterface $to): array
    {
        $days = min(90, (int) $from->startOfDay()->diffInDays($to->endOfDay()) + 1);

        $dailyTotals = Payment::query()
            ->selectRaw('DATE(paid_at) as date, SUM(amount) as total')
            ->where('status', 'confirmed')
            ->whereBetween('paid_at', [$from, $to])
            ->groupBy('date')
            ->pluck('total', 'date');

        return collect(range(0, $days - 1))
            ->map(function (int $offset) use ($from, $dailyTotals) {
                $date = $from->copy()->addDays($offset)->toDateString();

                return [
                    'date' => $date,
                    'amount' => (float) ($dailyTotals[$date] ?? 0),
                ];
            })
            ->all();
    }
}
