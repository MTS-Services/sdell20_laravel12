<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New LPA Completed - {{ config('app.name') }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 640px;
            margin: 32px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .email-header {
            background: #0f172a;
            color: #ffffff;
            padding: 28px 24px;
        }

        .email-header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
        }

        .email-body {
            padding: 28px 24px;
        }

        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
        }

        .meta-table th,
        .meta-table td {
            text-align: left;
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }

        .meta-table th {
            width: 180px;
            color: #0f172a;
            font-weight: 600;
        }

        .meta-table td {
            color: #334155;
        }

        .cta-button {
            display: inline-block;
            margin-top: 18px;
            background: #0f172a;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
        }

        .link-list {
            margin-top: 18px;
            padding: 14px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
        }

        .link-list p {
            margin: 6px 0;
            font-size: 14px;
        }

        .link-list a {
            color: #1d4ed8;
            text-decoration: none;
            word-break: break-all;
        }
        .link-list a:hover{
            text-decoration: underline;
        }

        .email-footer {
            background: #f8fafc;
            color: #64748b;
            font-size: 12px;
            padding: 18px 24px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>New LPA Completion Notification</h1>
        </div>

        <div class="email-body">
            <p>A customer has successfully completed an LPA payment.</p>

            <table class="meta-table">
                <tr>
                    <th>Customer Name</th>
                    <td>{{ $lpa->user->name ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Customer Email</th>
                    <td>{{ $lpa->user->email ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>LPA Type</th>
                    <td>{{ $lpa->isPropertyAndFinance() ? 'Property & Finance' : 'Health & Welfare' }}</td>
                </tr>
                <tr>
                    <th>Total Paid</th>
                    <td>£{{ number_format((float) $lpa->amount, 2) }}</td>
                </tr>
                <tr>
                    <th>Completed At</th>
                    <td>{{ optional($lpa->paid_at)->format('d M Y H:i') ?? now()->format('d M Y H:i') }}</td>
                </tr>
                <tr>
                    <th>Payment Reference</th>
                    <td>{{ $lpa->payment_reference ?: 'N/A' }}</td>
                </tr>
                <tr>
                    <th>LPA ID</th>
                    <td>#{{ $lpa->id }}</td>
                </tr>
            </table>

            <div class="link-list">
                <p><strong>PDF Preview:</strong>
                    <a href="{{ route('lpas.pdf.preview', $lpa) }}">{{ route('lpas.pdf.preview', $lpa) }}</a>
                </p>
                <p><strong>PDF Download:</strong>
                    <a href="{{ route('lpas.pdf.download', $lpa) }}">{{ route('lpas.pdf.download', $lpa) }}</a>
                </p>
            </div>

            <a class="cta-button" href="{{ config('app.url') }}/admin/dashboard">Open Admin Panel</a>
        </div>

        <div class="email-footer">
            This is an automated notification from {{ config('app.name') }}.
        </div>
    </div>
</body>

</html>
