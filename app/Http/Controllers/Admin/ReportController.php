<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Reports\BuildAdminReport;
use App\Actions\Reports\RenderReportPdf;
use App\Http\Controllers\Controller;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ReportController extends Controller
{
    /**
     * Display the admin reports page for an admin-chosen date range.
     */
    public function index(Request $request, BuildAdminReport $action): InertiaResponse
    {
        [$from, $to] = $this->dateRange($request);

        return Inertia::render('admin/reports/index', [
            'report' => $action->handle($from, $to),
            'filters' => [
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }

    /**
     * Export the report as a CSV file.
     */
    public function exportCsv(Request $request, BuildAdminReport $action): HttpResponse
    {
        [$from, $to] = $this->dateRange($request);
        $report = $action->handle($from, $to);

        $rows = [
            ['Report range', "{$from->toDateString()} to {$to->toDateString()}"],
            ['Revenue', number_format($report['revenue'], 2)],
            ['Reservations created', $report['reservationsCreatedCount']],
            ['Outstanding invoices', $report['outstandingInvoicesCount']],
            ['Maintenance requests resolved', $report['maintenanceResolvedCount']],
            ['New maintenance requests', $report['maintenanceNewCount']],
            ['Average resolution time (hours)', $report['maintenanceAvgResolutionHours'] ?? 'n/a'],
            [],
            ['Date', 'Revenue'],
            ...array_map(fn (array $point) => [$point['date'], number_format($point['amount'], 2)], $report['revenueByDay']),
        ];

        $csv = collect($rows)->map(fn (array $row) => implode(',', $row))->implode("\n");

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"report-{$from->toDateString()}-to-{$to->toDateString()}.csv\"",
        ]);
    }

    /**
     * Export the report as a PDF file.
     */
    public function exportPdf(Request $request, BuildAdminReport $action, RenderReportPdf $renderReportPdf): SymfonyResponse
    {
        [$from, $to] = $this->dateRange($request);
        $report = $action->handle($from, $to);

        return $renderReportPdf->handle($from, $to, $report)
            ->download("report-{$from->toDateString()}-to-{$to->toDateString()}.pdf");
    }

    /**
     * @return array{0: CarbonInterface, 1: CarbonInterface}
     */
    private function dateRange(Request $request): array
    {
        $filters = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $from = isset($filters['from']) ? Carbon::parse($filters['from'])->startOfDay() : now()->startOfMonth();
        $to = isset($filters['to']) ? Carbon::parse($filters['to'])->endOfDay() : now()->endOfDay();

        return [$from, $to];
    }
}
