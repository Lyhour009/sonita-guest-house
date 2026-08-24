<?php

namespace App\Actions\Reports;

use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as PdfDocument;
use Carbon\CarbonInterface;

class RenderReportPdf
{
    /**
     * @param  array<string, mixed>  $report
     */
    public function handle(CarbonInterface $from, CarbonInterface $to, array $report): PdfDocument
    {
        return Pdf::loadView('reports.pdf', [
            'from' => $from,
            'to' => $to,
            'report' => $report,
        ])->setPaper('a4');
    }
}
