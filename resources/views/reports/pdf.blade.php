<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Admin Report {{ $from->toDateString() }} to {{ $to->toDateString() }}</title>
    <style>
        @page { margin: 36px 40px; }
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #1f2937; }
        .header { width: 100%; margin-bottom: 24px; }
        .header td { vertical-align: top; }
        .brand { font-size: 20px; font-weight: bold; color: #111827; }
        .muted { color: #6b7280; }
        table.stats { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        table.stats th, table.stats td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 6px;
            text-align: left;
        }
        table.stats th { color: #6b7280; font-weight: normal; font-size: 11px; text-transform: uppercase; }
        table.stats td.amount, table.stats th.amount { text-align: right; }
        .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                <div class="brand">Hour Guest House</div>
                <div class="muted">Admin Report</div>
            </td>
            <td style="text-align: right;">
                <div class="muted">Range</div>
                <div>{{ $from->format('M j, Y') }} &rarr; {{ $to->format('M j, Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="stats">
        <thead>
            <tr>
                <th>Metric</th>
                <th class="amount">Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Revenue</td>
                <td class="amount">${{ number_format($report['revenue'], 2) }}</td>
            </tr>
            <tr>
                <td>Reservations created</td>
                <td class="amount">{{ $report['reservationsCreatedCount'] }}</td>
            </tr>
            <tr>
                <td>Outstanding invoices</td>
                <td class="amount">{{ $report['outstandingInvoicesCount'] }}</td>
            </tr>
            <tr>
                <td>Maintenance requests resolved</td>
                <td class="amount">{{ $report['maintenanceResolvedCount'] }}</td>
            </tr>
            <tr>
                <td>New maintenance requests</td>
                <td class="amount">{{ $report['maintenanceNewCount'] }}</td>
            </tr>
            <tr>
                <td>Average resolution time</td>
                <td class="amount">{{ $report['maintenanceAvgResolutionHours'] !== null ? $report['maintenanceAvgResolutionHours'] . ' hrs' : 'n/a' }}</td>
            </tr>
        </tbody>
    </table>

    <table class="stats">
        <thead>
            <tr>
                <th>Date</th>
                <th class="amount">Revenue</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($report['revenueByDay'] as $point)
                <tr>
                    <td>{{ $point['date'] }}</td>
                    <td class="amount">${{ number_format($point['amount'], 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">Hour Guest House &middot; Generated {{ now()->format('M j, Y H:i') }}</div>
</body>
</html>
