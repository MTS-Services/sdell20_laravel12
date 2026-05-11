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

            <p>Great news! Your Lasting Power of Attorney (LPA) payment is complete. Below is a copy of the answers you
                gave during your application (matching the LP1H / LP1F style sections).</p>

            @php
                $product = \App\Enums\PaymentProduct::fromLpaType($lpa->document_type ?? 'health');
                $registrarPounds = $product->registrarFeeInPence() / 100;
                $baseExVatPounds = $product->baseAmountInPence() / 100;
                $vatPounds = $product->vatAmountInPence() / 100;
                $donor = $lpa->donor_details ?? [];
                $contact = $lpa->contact_details ?? [];
                $donorLine = trim(
                    ($donor['title'] ?? '') .
                        ' ' .
                        ($donor['firstName'] ?? '') .
                        ' ' .
                        ($donor['middleNames'] ?? '') .
                        ' ' .
                        ($donor['lastName'] ?? ''),
                );
                $addrParts = array_filter([
                    $contact['addressLine1'] ?? null,
                    $contact['town'] ?? null,
                    $contact['postcode'] ?? null,
                ]);
                $addr = implode(', ', $addrParts);
            @endphp

            <div class="highlight-box">
                <table class="details-table">
                    <tr>
                        <th>LPA type</th>
                        <td>
                            @if ($lpa->isBoth())
                                Health &amp; welfare + property &amp; finance
                            @elseif ($lpa->isHealthAndWelfare())
                                Health &amp; welfare (LP1H)
                            @else
                                Property &amp; financial affairs (LP1F)
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <th>Who for</th>
                        <td>{{ $lpa->who_for }}</td>
                    </tr>
                    <tr>
                        <th>Donor (Section 1)</th>
                        <td>{{ $donorLine !== '' ? $donorLine : '—' }}</td>
                    </tr>
                    <tr>
                        <th>Contact address</th>
                        <td>{{ $addr !== '' ? $addr : '—' }}</td>
                    </tr>
                    <tr>
                        <th>Contact email</th>
                        <td>{{ $contact['email'] ?? '—' }}</td>
                    </tr>
                    <tr>
                        <th>Attorneys may view legal documents</th>
                        <td>{{ $lpa->can_view_documents ? 'Yes' : 'No' }}</td>
                    </tr>
                    <tr>
                        <th>Replacement attorneys</th>
                        <td>
                            @if ($lpa->want_replacement_attorneys)
                                Yes — {{ count($lpa->replacement_attorneys ?? []) }} named
                            @else
                                No
                            @endif
                        </td>
                    </tr>
                    @if ($lpa->isHealthAndWelfare() || $lpa->isBoth())
                        <tr>
                            <th>Life-sustaining treatment</th>
                            <td>{{ $lpa->life_sustaining_treatment ? 'Attorneys may give consent' : 'Not delegated to attorneys' }}
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <th>People to notify</th>
                        <td>{{ $lpa->notify_people ? 'Yes' : 'No' }}</td>
                    </tr>
                    <tr>
                        <th>Who applies to register</th>
                        <td>{{ $lpa->applicant ?: '—' }}</td>
                    </tr>
                    <tr>
                        <th>Registered document sent to</th>
                        <td>{{ $lpa->document_recipient ?: '—' }}</td>
                    </tr>
                    <tr>
                        <th>Certificate provider chosen now</th>
                        <td>{{ $lpa->certificate_choice ? 'Yes' : 'No' }}</td>
                    </tr>
                </table>
            </div>

            @if (!empty($lpa->attorneys))
                <h2 style="font-size:18px;color:#667eea;margin-top:28px;">Attorneys (Section 2)</h2>
                <table class="details-table">
                    @foreach ($lpa->attorneys as $i => $a)
                        <tr>
                            <th>Attorney {{ $i + 1 }}</th>
                            <td>
                                {{ trim(($a['title'] ?? '') . ' ' . ($a['firstName'] ?? '') . ' ' . ($a['middleNames'] ?? '') . ' ' . ($a['lastName'] ?? '')) }}<br>
                                @if (!empty($a['email']))
                                    Email: {{ $a['email'] }}<br>
                                @endif
                                @if (!empty($a['addressLine1']) || !empty($a['postcode']))
                                    {{ $a['addressLine1'] ?? '' }}@if (!empty($a['addressLine2']))
                                        , {{ $a['addressLine2'] }}
                                    @endif
                                    <br>
                                    {{ trim(($a['town'] ?? '') . ' ' . ($a['county'] ?? '') . ' ' . ($a['postcode'] ?? '')) }}
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </table>
            @endif

            @if (!empty($lpa->replacement_attorneys))
                <h2 style="font-size:18px;color:#667eea;margin-top:28px;">Replacement attorneys (Section 4)</h2>
                <table class="details-table">
                    @foreach ($lpa->replacement_attorneys as $i => $a)
                        <tr>
                            <th>Replacement {{ $i + 1 }}</th>
                            <td>
                                {{ trim(($a['title'] ?? '') . ' ' . ($a['firstName'] ?? '') . ' ' . ($a['middleNames'] ?? '') . ' ' . ($a['lastName'] ?? '')) }}<br>
                                @if (!empty($a['email']))
                                    Email: {{ $a['email'] }}<br>
                                @endif
                                @if (!empty($a['addressLine1']) || !empty($a['postcode']))
                                    {{ $a['addressLine1'] ?? '' }}@if (!empty($a['addressLine2']))
                                        , {{ $a['addressLine2'] }}
                                    @endif
                                    <br>
                                    {{ trim(($a['town'] ?? '') . ' ' . ($a['county'] ?? '') . ' ' . ($a['postcode'] ?? '')) }}
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </table>
            @endif

            <div class="highlight-box" style="margin-top:24px;">
                <table class="details-table">
                    <tr>
                        <th>Service (ex VAT)</th>
                        <td>£{{ number_format($baseExVatPounds, 2) }}</td>
                    </tr>
                    <tr>
                        <th>VAT (20%)</th>
                        <td>£{{ number_format($vatPounds, 2) }}</td>
                    </tr>
                    @if ($registrarPounds > 0)
                        <tr>
                            <th>OPG registration fee</th>
                            <td>£{{ number_format($registrarPounds, 2) }}</td>
                        </tr>
                    @endif
                    <tr>
                        <th>Total paid</th>
                        <td>£{{ number_format((float) $lpa->amount, 2) }}</td>
                    </tr>
                    <tr>
                        <th>Date of completion</th>
                        <td>{{ $lpa->paid_at ? $lpa->paid_at->format('d M Y') : now()->format('d M Y') }}</td>
                    </tr>
                    @if ($lpa->payment_reference)
                        <tr>
                            <th>Payment reference</th>
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
