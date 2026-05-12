<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Will Completed - {{ config('app.name') }}</title>
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

        .section-block {
            margin-top: 28px;
        }

        .section-block h2 {
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            padding-bottom: 6px;
            border-bottom: 2px solid #e2e8f0;
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
            <h1>New Will Completion Notification</h1>
        </div>

        <div class="email-body">
            <p>A customer has successfully completed a Will payment. Summary below.</p>

            @foreach ($summarySections as $section)
                <div class="section-block">
                    <h2>{{ $section['title'] }}</h2>
                    <table class="meta-table">
                        @foreach ($section['rows'] as $row)
                            <tr>
                                <th>{{ $row['label'] }}</th>
                                <td>{!! nl2br(e($row['value'])) !!}</td>
                            </tr>
                        @endforeach
                    </table>
                </div>
            @endforeach

            <a class="cta-button" href="{{ config('app.url') }}/admin/dashboard">Open Admin Panel</a>
        </div>

        <div class="email-footer">
            This is an automated notification from {{ config('app.name') }}.
        </div>
    </div>
</body>

</html>
