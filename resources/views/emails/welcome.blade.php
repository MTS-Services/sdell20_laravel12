<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
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

        .features-list {
            list-style: none;
            padding: 0;
            margin: 25px 0;
        }

        .features-list li {
            padding: 12px 0;
            padding-left: 30px;
            position: relative;
            color: #555555;
        }

        .features-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 18px;
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
            <h1>Welcome to {{ config('app.name') }}!</h1>
        </div>

        <div class="email-body">
            <h2>Hello {{ $user->name }},</h2>

            <p>We're thrilled to have you on board! Thank you for choosing {{ config('app.name') }} as your trusted
                platform for managing your legal documents and services.</p>

            <p>Your account email: <strong>{{ $user->email }}</strong></p>

            <div class="highlight-box">
                <p><strong>Your account is now active and ready to use.</strong></p>
            </div>

            <p>With {{ config('app.name') }}, you can:</p>

            <ul class="features-list">
                <li>Create and manage Lasting Power of Attorney (LPA) documents</li>
                <li>Prepare comprehensive Will documents</li>
                <li>Access your documents securely anytime, anywhere</li>
                <li>Track your document status and progress</li>
                <li>Receive expert guidance throughout the process</li>
            </ul>

            <p>Ready to get started? Click the button below to access your dashboard:</p>

            <center>
                <a href="{{ route('dashboard') }}" class="cta-button">Go to Dashboard</a>
            </center>

            <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this
                email or visit our help center.</p>

            <p>We're excited to be part of your journey in securing your future and protecting what matters most.</p>

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
