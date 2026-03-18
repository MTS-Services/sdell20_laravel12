<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment completed - {{ config('app.name') }}</title>
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
            background: linear-gradient(135deg, #0f182e 0%, #6d28d9 100%);
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
            color: #0f182e;
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
            border-left: 4px solid #0f182e;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }

        .highlight-box p {
            margin: 0;
            color: #333333;
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
            color: #6d28d9;
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
            <h1>Payment completed</h1>
        </div>

        <div class="email-body">
            <h2>Hello {{ $payment->user->name }},</h2>

            <p>Your payment has been completed successfully.</p>

            <div class="highlight-box">
                <p><strong>Amount paid:</strong> £{{ number_format($payment->amount / 100, 2) }}</p>
                <p><strong>Status:</strong> {{ $payment->status->label() }}</p>
            </div>

            <p>Thank you for your order. If you need help, please reply to this email and we’ll be happy to assist.</p>

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
