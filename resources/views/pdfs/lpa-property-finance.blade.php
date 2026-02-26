<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lasting Power of Attorney - Property and Financial Affairs</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm;
            position: relative;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
        }
        
        .crown-logo {
            width: 40px;
            height: 40px;
            margin-right: 10px;
        }
        
        .office-info h2 {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .office-info p {
            font-size: 9pt;
        }
        
        .contact-info {
            text-align: right;
            font-size: 9pt;
        }
        
        .title {
            font-size: 16pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
        }
        
        .subtitle {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 20px;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: bold;
            margin-bottom: 10px;
            background: #f0f0f0;
            padding: 5px;
        }
        
        .field-group {
            margin-bottom: 15px;
        }
        
        .field-label {
            font-size: 9pt;
            font-weight: bold;
            margin-bottom: 3px;
        }
        
        .field-value {
            border: 1px solid #000;
            padding: 5px;
            min-height: 25px;
            background: #fff;
        }
        
        .field-row {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
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
            top: 15mm;
            right: 15mm;
            width: 80px;
            height: 80px;
            border: 1px solid #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
        }
        
        .draft-watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120pt;
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
            display: flex;
            gap: 5px;
        }
        
        .date-field {
            width: 30px;
            height: 30px;
            border: 1px solid #000;
            text-align: center;
            line-height: 30px;
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
            font-size: 9pt;
            margin-top: 10px;
            padding: 10px;
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    @if($isDraft)
    <div class="draft-watermark">DRAFT</div>
    @endif
    
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="crown-logo">
                    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <text x="20" y="25" font-size="30" text-anchor="middle" font-weight="bold">👑</text>
                    </svg>
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
        
        <!-- Barcode -->
        <div class="barcode">
            <div style="writing-mode: vertical-rl; transform: rotate(180deg);">
                ||||||||||||
            </div>
        </div>
        
        <!-- Title -->
        <h1 class="title">Lasting power of attorney for</h1>
        <h2 class="subtitle">property and financial affairs</h2>
        
        <!-- Section 1: The Donor -->
        <div class="section">
            <div class="section-title">Section 1<br>The donor</div>
            
            <p style="margin-bottom: 10px; font-size: 10pt;">
                You are appointing other people to make decisions on your behalf.<br>
                You are the donor.
            </p>
            
            <div class="field-group">
                <div class="field-label">Title</div>
                <div class="field-value">{{ $lpa->donor_details['title'] ?? '' }}</div>
            </div>
            
            <div class="field-row">
                <div class="field-group">
                    <div class="field-label">First names</div>
                    <div class="field-value">{{ $lpa->donor_details['firstName'] ?? '' }}</div>
                </div>
            </div>
            
            <div class="field-group">
                <div class="field-label">Last name</div>
                <div class="field-value">{{ $lpa->donor_details['lastName'] ?? '' }}</div>
            </div>
            
            <div class="field-group">
                <div class="field-label">Any other names you're known by - (optional - eg your maiden name)</div>
                <div class="field-value">{{ $lpa->donor_details['otherNames'] ?? '' }}</div>
            </div>
            
            <div class="field-group">
                <div class="field-label">Date of birth</div>
                <div class="date-fields">
                    <div class="date-field">{{ $lpa->donor_details['birthDay'] ?? '' }}</div>
                    <div class="date-field">{{ $lpa->donor_details['birthMonth'] ?? '' }}</div>
                    <div class="date-field">{{ $lpa->donor_details['birthYear'] ?? '' }}</div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <div class="field-label">Address</div>
                <div class="field-value">{{ $lpa->contact_details['addressLine1'] ?? '' }}</div>
                <div class="field-value" style="margin-top: 5px;">{{ $lpa->contact_details['addressLine2'] ?? '' }}</div>
                <div class="field-value" style="margin-top: 5px;">{{ $lpa->contact_details['town'] ?? '' }}</div>
                <div class="field-value" style="margin-top: 5px;">{{ $lpa->contact_details['county'] ?? '' }}</div>
            </div>
            
            <div class="field-group" style="margin-top: 10px;">
                <div class="field-label">Postcode</div>
                <div class="field-value">{{ $lpa->contact_details['postcode'] ?? '' }}</div>
            </div>
            
            <div class="opg-info">
                <p><strong>For OPG office use only</strong></p>
                <div style="margin-top: 10px;">
                    <div class="field-label">LPA registration date</div>
                    <div class="date-fields">
                        <div class="date-field"></div>
                        <div class="date-field"></div>
                        <div class="date-field"></div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <div class="field-label">OPG reference number</div>
                    <div class="field-value"></div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px; font-size: 9pt; text-align: center; color: #666;">
            <p>LPA Form - Property and Financial Affairs | Generated: {{ now()->format('d/m/Y H:i') }}</p>
            @if($isDraft)
            <p style="color: red; font-weight: bold;">DRAFT - Not for official use</p>
            @endif
        </div>
    </div>
</body>
</html>
