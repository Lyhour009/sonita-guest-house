<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->id }}</title>
    <style>
        @page { margin: 36px 40px; }
        body { font-family: 'Helvetica', sans-serif; font-size: 12px; color: #1f2937; }
        .header { width: 100%; margin-bottom: 24px; }
        .header td { vertical-align: top; }
        .brand { font-size: 20px; font-weight: bold; color: #111827; }
        .muted { color: #6b7280; }
        .status {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-partial { background: #fef9c3; color: #854d0e; }
        .status-unpaid { background: #fee2e2; color: #991b1b; }
        .info-table { width: 100%; margin-bottom: 24px; }
        .info-table td { vertical-align: top; padding-bottom: 4px; }
        table.charges { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        table.charges th, table.charges td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 6px;
            text-align: left;
        }
        table.charges th { color: #6b7280; font-weight: normal; font-size: 11px; text-transform: uppercase; }
        table.charges td.amount, table.charges th.amount { text-align: right; }
        .totals-table { width: 100%; margin-top: 8px; }
        .totals-table td { padding: 4px 6px; text-align: right; }
        .totals-table .label { color: #6b7280; }
        .grand-total { font-size: 15px; font-weight: bold; border-top: 2px solid #111827; }
        .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                <div class="brand">Hour Guest House</div>
                <div class="muted">Invoice</div>
            </td>
            <td style="text-align: right;">
                <div class="muted">Invoice ID</div>
                <div>{{ Str::upper(Str::substr($invoice->id, 0, 8)) }}</div>
                <div class="muted" style="margin-top: 6px;">Issued</div>
                <div>{{ $invoice->created_at?->format('M j, Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td style="width: 33%;">
                <div class="muted">Billed to</div>
                <div><strong>{{ $guest->full_name }}</strong></div>
                <div>{{ $guest->email }}</div>
            </td>
            <td style="width: 33%;">
                <div class="muted">Room</div>
                <div><strong>Room {{ $room->room_number }}</strong></div>
                <div>{{ ucfirst(str_replace('_', ' ', $room->room_type)) }}</div>
            </td>
            <td style="width: 34%;">
                <div class="muted">Status</div>
                <div>
                    <span class="status status-{{ $invoice->status }}">{{ $invoice->status }}</span>
                </div>
                @if ($invoice->due_date)
                    <div class="muted" style="margin-top: 6px;">Due date</div>
                    <div>{{ $invoice->due_date->format('M j, Y') }}</div>
                @endif
            </td>
        </tr>
    </table>

    <table class="charges">
        <thead>
            <tr>
                <th>Description</th>
                <th class="amount">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    {{ $invoice->invoice_type === 'long_stay' ? 'Room charge (monthly)' : 'Room charge' }}
                    @if ($invoice->billing_period)
                        <div class="muted">{{ $invoice->billing_period->format('F Y') }}</div>
                    @endif
                </td>
                <td class="amount">${{ number_format((float) $invoice->room_charge, 2) }}</td>
            </tr>
            @if ((float) $invoice->service_charge > 0)
                <tr>
                    <td>Services</td>
                    <td class="amount">${{ number_format((float) $invoice->service_charge, 2) }}</td>
                </tr>
            @endif
            @if (! is_null($invoice->utility_charge))
                <tr>
                    <td>
                        Utilities (electricity &amp; water)
                        @if (! is_null($invoice->elec_meter_start))
                            <div class="muted">
                                Elec: {{ $invoice->elec_meter_start }} &rarr; {{ $invoice->elec_meter_end }},
                                Water: {{ $invoice->water_meter_start }} &rarr; {{ $invoice->water_meter_end }}
                            </div>
                        @endif
                    </td>
                    <td class="amount">${{ number_format((float) $invoice->utility_charge, 2) }}</td>
                </tr>
            @endif
            <tr>
                <td>Tax</td>
                <td class="amount">${{ number_format((float) $invoice->tax_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <td class="label">Total amount</td>
            <td style="width: 120px;">${{ number_format((float) $invoice->total_amount, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Paid</td>
            <td>${{ number_format($confirmedPaid, 2) }}</td>
        </tr>
        <tr class="grand-total">
            <td>Balance due</td>
            <td>${{ number_format($outstandingBalance, 2) }}</td>
        </tr>
    </table>

    @if ($settings?->payment_instruction)
        <p class="muted" style="margin-top: 24px;">{{ $settings->payment_instruction }}</p>
    @endif

    <div class="footer">Hour Guest House &middot; Thank you for staying with us.</div>
</body>
</html>
