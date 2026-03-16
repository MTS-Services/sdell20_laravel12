<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LPA Completed - {{ config('app.name') }}</title>
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
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
        }

        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .email-body {
            padding: 40px 30px;
        }

        .email-body h2 {
            color: #667eea;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
        }

        .email-body p {
            margin: 16px 0;
            color: #555555;
            font-size: 16px;
        }

        .highlight-box {
            background-color: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }

        .highlight-box p {
            margin: 0;
            color: #333333;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .details-table th,
        .details-table td {
            padding: 12px;
            border-bottom: 1px solid #eeeeee;
            text-align: left;
        }

        .details-table th {
            color: #667eea;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        .email-footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .email-footer p {
            margin: 8px 0;
            color: #6c757d;
            font-size: 14px;
        }

        .email-footer a {
            color: #667eea;
            text-decoration: none;
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 20px;
            }

            .email-header,
            .email-body,
            .email-footer {
                padding: 25px 20px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1>LPA Completed Successfully</h1>
        </div>

        <div class="email-body">
            <h2>Hello {{ $lpa->user->name }},</h2>

            <p>Great news! Your Lasting Power of Attorney (LPA) document has been successfully created and completed.
            </p>

            <div class="highlight-box">
                <table class="details-table">
                    <tr>
                        <th>LPA Type</th>
                        <td>{{ $lpa->isPropertyAndFinance() ? 'Property & Finance' : 'Health & Welfare' }}</td>
                    </tr>
                    <tr>
                        <th>Subtotal</th>
                        <td>£{{ number_format(($lpa->amount - 92) / 1.2, 2) }}</td>
                    </tr>
                    <tr>
                        <th>VAT (20%)</th>
                        <td>£{{ number_format($lpa->amount - 92 - ($lpa->amount - 92) / 1.2, 2) }}</td>
                    </tr>
                    <tr>
                        <th>OPG Registrar Fee</th>
                        <td>£92.00</td>
                    </tr>
                    <tr>
                        <th>Total Amount Paid</th>
                        <td>£{{ number_format($lpa->amount, 2) }}</td>
                    </tr>
                    <tr>
                        <th>Date of Completion</th>
                        <td>{{ $lpa->paid_at ? $lpa->paid_at->format('d M Y') : now()->format('d M Y') }}</td>
                    </tr>
                    @if ($lpa->payment_reference)
                        <tr>
                            <th>Payment Ref</th>
                            <td>{{ $lpa->payment_reference }}</td>
                        </tr>
                    @endif
                </table>
            </div>

            <p>You can now log in to your account to review your document and proceed with the next steps.</p>

            <center>
                <a href="{{ route('dashboard') }}" class="cta-button">View Your Document</a>
            </center>

            <p>If you have any questions or need further assistance with your LPA, please do not hesitate to contact our
                support team.</p>

            <p>Best regards,<br>
                <strong>The {{ config('app.name') }} Team</strong>
            </p>
        </div>

        <div class="email-footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>
                <a href="{{ config('app.url') }}">Visit our website</a> |
                <a href="mailto:{{ config('mail.from.address') }}">Contact Support</a>
            </p>
        </div>
    </div>
</body>

</html>
