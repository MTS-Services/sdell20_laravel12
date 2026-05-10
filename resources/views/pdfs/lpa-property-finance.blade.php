<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lasting Power of Attorney - Property and Financial Affairs</title>
    <style>
        @page {
            margin: 6mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.2;
            color: #000;
            background: #fff;
        }

        .page {
            width: 96%;
            min-height: auto;
            padding: 3mm;
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
        }

        .logo-section {
            display: flex;
            align-items: center;
        }

        .crown-logo {
            width: 24px;
            height: 24px;
            margin-right: 6px;
        }

        .crown-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .office-info h2 {
            font-size: 8.5pt;
            font-weight: bold;
            margin-bottom: 1px;
        }

        .office-info p {
            font-size: 9pt;
        }

        .contact-info {
            margin-top: 8px;
            text-align: right;
            font-size: 7pt;
        }

        .title {
            font-size: 12pt;
            font-weight: bold;
            margin: 8px 0 3px 0;
        }

        .subtitle {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .section {
            margin-bottom: 8px;
        }

        .section-title {
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 4px;
            background: #f0f0f0;
            padding: 3px;
        }

        .field-group {
            margin-bottom: 5px;
        }

        .field-label {
            font-size: 7pt;
            font-weight: bold;
            margin-bottom: 1px;
        }

        .field-value {
            border: 1px solid #000;
            padding: 2px 3px;
            min-height: 14px;
            background: #fff;
            font-size: 7pt;
        }

        .field-row {
            display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }

        .field-row .field-group {
            flex: 1;
            margin-bottom: 0;
        }

        .help-box {
            border: 1px solid #000;
            padding: 10px;
            background: #f9f9f9;
            font-size: 9pt;
            margin-left: 20px;
        }

        .help-box h4 {
            font-size: 10pt;
            margin-bottom: 5px;
        }

        .barcode {
            position: absolute;
            top: 6mm;
            right: 6mm;
            width: 38px;
            height: 46px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6pt;
        }

        .draft-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 56pt;
            color: rgba(255, 0, 0, 0.1);
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
        }

        .restrictions-note {
            font-size: 9pt;
            font-style: italic;
            margin-top: 5px;
        }

        .date-fields {
            border-collapse: separate;
            border-spacing: 5px 0;
        }

        .date-field {
            width: 24px;
            height: 16px;
            border: 1px solid #000;
            text-align: center;
            line-height: 16px;
            font-size: 7pt;
            overflow: hidden;
            white-space: nowrap;
            vertical-align: middle;
            padding: 0;
        }

        .checkbox-field {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1px solid #000;
            margin-right: 5px;
            vertical-align: middle;
        }

        .opg-info {
            font-size: 7pt;
            margin-top: 5px;
            padding: 6px;
            background: #f0f0f0;
        }
    </style>
</head>

<body>
    @php
        $clean = static function (mixed $value, int $limit = 120): string {
            $text = trim(preg_replace('/\s+/', ' ', strip_tags((string) $value)));

            return substr($text, 0, $limit);
        };

        $titleValue = $clean($lpa->donor_details['title'] ?? '', 10);
        $firstName = $clean($lpa->donor_details['firstName'] ?? '', 60);
        $lastName = $clean($lpa->donor_details['lastName'] ?? '', 60);
        $otherNames = $clean($lpa->donor_details['otherNames'] ?? '', 90);

        $address1 = $clean($lpa->contact_details['addressLine1'] ?? '', 80);
        $address2 = $clean($lpa->contact_details['addressLine2'] ?? '', 80);
        $town = $clean($lpa->contact_details['town'] ?? '', 80);
        $county = $clean($lpa->contact_details['county'] ?? '', 80);
        $postcode = $clean($lpa->contact_details['postcode'] ?? '', 20);

        $birthDay = substr(preg_replace('/\D+/', '', (string) ($lpa->donor_details['birthDay'] ?? '')), 0, 2);
        $birthMonth = substr(preg_replace('/\D+/', '', (string) ($lpa->donor_details['birthMonth'] ?? '')), 0, 2);
        $birthYear = substr(preg_replace('/\D+/', '', (string) ($lpa->donor_details['birthYear'] ?? '')), 0, 4);

        $generatedAt = $lpa->created_at ? \Illuminate\Support\Carbon::parse($lpa->created_at) : now();
        $regDay = $generatedAt->format('d');
        $regMonth = $generatedAt->format('m');
        $regYear = $generatedAt->format('Y');
    @endphp

    @if ($isDraft)
        <div class="draft-watermark">DRAFT</div>
    @endif

    <div class="page">
        <div class="header">
            <div class="logo-section">
                <div class="crown-logo">
                    <img src="{{ public_path('crown.svg') }}" alt="Crown logo">
                </div>
                <div class="office-info">
                    <h2>Office of the</h2>
                    <h2>Public Guardian</h2>
                </div>
            </div>
            <div class="contact-info">
                <p><strong>Helpline</strong></p>
                <p>0300-456-0300</p>
            </div>
        </div>

        <div class="barcode">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg);">
                ||||||||||||
            </div>
        </div>

        <h1 class="title">Lasting power of attorney for</h1>
        <h2 class="subtitle">property and financial affairs</h2>

        <div class="section">
            <div class="section-title">Section 1<br>The donor</div>

            <p style="margin-bottom: 4px; font-size: 7pt;">
                You are appointing other people to make decisions on your behalf.<br>
                You are the donor.
            </p>

            <div class="field-group">
                <div class="field-label">Title</div>
                <div class="field-value">{{ $titleValue }}</div>
            </div>

            <div class="field-row">
                <div class="field-group">
                    <div class="field-label">First names</div>
                    <div class="field-value">{{ $firstName }}</div>
                </div>
            </div>

            <div class="field-group">
                <div class="field-label">Last name</div>
                <div class="field-value">{{ $lastName }}</div>
            </div>

            <div class="field-group">
                <div class="field-label">Any other names you're known by - (optional - eg your married name)</div>
                <div class="field-value">{{ $otherNames }}</div>
            </div>

            <div class="field-group">
                <div class="field-label">Date of birth</div>
                <table class="date-fields" role="presentation">
                    <tr>
                        <td class="date-field">{{ $birthDay }}</td>
                        <td class="date-field">{{ $birthMonth }}</td>
                        <td class="date-field">{{ $birthYear }}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-top: 6px;">
                <div class="field-label">Address</div>
                <div class="field-value">{{ $address1 }}</div>
                <div class="field-value" style="margin-top: 2px;">{{ $address2 }}</div>
                <div class="field-value" style="margin-top: 2px;">{{ $town }}</div>
                <div class="field-value" style="margin-top: 2px;">{{ $county }}</div>
            </div>

            <div class="field-group" style="margin-top: 4px;">
                <div class="field-label">Postcode</div>
                <div class="field-value">{{ $postcode }}</div>
            </div>

            <div class="opg-info">
                <p><strong>For OPG office use only</strong></p>
                <div style="margin-top: 4px;">
                    <div class="field-label">LPA registration date</div>
                    <table class="date-fields" role="presentation">
                        <tr>
                            <td class="date-field">{{ $regDay }}</td>
                            <td class="date-field">{{ $regMonth }}</td>
                            <td class="date-field">{{ $regYear }}</td>
                        </tr>
                    </table>
                </div>
                <div style="margin-top: 4px;">
                    <div class="field-label">OPG reference number</div>
                    <div class="field-value"></div>
                </div>
            </div>
        </div>

        @include('pdfs.partials.lpa-form-extras', ['lpa' => $lpa])

        <div style="margin-top: 8px; font-size: 6pt; text-align: center; color: #666;">
            <p>LPA Form - Property and Financial Affairs | Generated: {{ now()->format('d/m/Y H:i') }}</p>
            @if ($isDraft)
                <p style="color: red; font-weight: bold; font-size: 6pt;">DRAFT - Not for official use</p>
            @endif
        </div>
    </div>
</body>

</html>
