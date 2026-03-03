<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Last Will and Testament</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #000;
            background: #fff;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            position: relative;
        }
        
        @if($isDraft)
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120pt;
            font-weight: bold;
            color: rgba(200, 200, 200, 0.3);
            z-index: -1;
            pointer-events: none;
        }
        @endif
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
        }
        
        .header h1 {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .header .subtitle {
            font-size: 12pt;
            font-style: italic;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        
        .clause {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .clause-number {
            font-weight: bold;
            margin-right: 5px;
        }
        
        .field-group {
            margin-bottom: 12px;
        }
        
        .field-label {
            font-weight: bold;
            display: inline-block;
            min-width: 150px;
        }
        
        .field-value {
            display: inline;
        }
        
        .signature-section {
            margin-top: 50px;
            page-break-inside: avoid;
        }
        
        .signature-line {
            border-top: 1px solid #000;
            width: 300px;
            margin-top: 40px;
            padding-top: 5px;
        }
        
        .witness-section {
            margin-top: 40px;
        }
        
        .witness-box {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .list-item {
            margin-left: 20px;
            margin-bottom: 8px;
        }
        
        .footer {
            position: fixed;
            bottom: 15mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    @if($isDraft)
    <div class="watermark">DRAFT</div>
    @endif
    
    <div class="page">
        <div class="header">
            <h1>Last Will and Testament</h1>
            <div class="subtitle">{{ $will->isMirrorWill() ? 'Mirror Will' : 'Single Will' }}</div>
        </div>
        
        <!-- Testator Information -->
        <div class="section">
            <div class="section-title">Declaration</div>
            <div class="clause">
                <span class="clause-number">1.</span>
                This is the Last Will and Testament of 
                <strong>{{ $will->personal_info['title'] ?? '' }} {{ $will->personal_info['firstName'] ?? '' }} {{ $will->personal_info['middleName'] ?? '' }} {{ $will->personal_info['lastName'] ?? '' }}</strong>,
                of {{ $will->personal_info['address'] ?? '' }}, {{ $will->personal_info['city'] ?? '' }}, {{ $will->personal_info['postcode'] ?? '' }}, {{ $will->personal_info['country'] ?? '' }}.
            </div>
            <div class="clause">
                <span class="clause-number">2.</span>
                I hereby revoke all former Wills and testamentary dispositions made by me and declare this to be my Last Will.
            </div>
        </div>
        
        <!-- Executors -->
        @if(!empty($will->executors))
        <div class="section">
            <div class="section-title">Appointment of Executors</div>
            <div class="clause">
                <span class="clause-number">3.</span>
                I appoint the following person(s) as Executor(s) of this Will:
            </div>
            @foreach($will->executors as $index => $executor)
            <div class="list-item">
                <strong>{{ $index + 1 }}.</strong> {{ $executor['title'] ?? '' }} {{ $executor['firstName'] ?? '' }} {{ $executor['lastName'] ?? '' }}
                of {{ $executor['city'] ?? '' }}, {{ $executor['country'] ?? '' }}
            </div>
            @endforeach
            
            @if(!empty($will->alternate_executors))
            <div class="clause">
                <span class="clause-number">4.</span>
                If any Executor named above is unable or unwilling to act, I appoint the following as substitute Executor(s):
            </div>
            @foreach($will->alternate_executors as $index => $executor)
            <div class="list-item">
                <strong>{{ $index + 1 }}.</strong> {{ $executor['title'] ?? '' }} {{ $executor['firstName'] ?? '' }} {{ $executor['lastName'] ?? '' }}
                of {{ $executor['city'] ?? '' }}, {{ $executor['country'] ?? '' }}
            </div>
            @endforeach
            @endif
        </div>
        @endif
        
        <!-- Guardians -->
        @if(!empty($will->guardians))
        <div class="section">
            <div class="section-title">Appointment of Guardians</div>
            <div class="clause">
                <span class="clause-number">5.</span>
                I appoint the following person(s) as Guardian(s) of my minor children:
            </div>
            @foreach($will->guardians as $index => $guardian)
            <div class="list-item">
                <strong>{{ $index + 1 }}.</strong> {{ $guardian['fullName'] ?? '' }}
                of {{ $guardian['city'] ?? '' }}, {{ $guardian['country'] ?? '' }}
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Beneficiaries -->
        @if(!empty($will->beneficiaries))
        <div class="section">
            <div class="section-title">Distribution of Estate</div>
            <div class="clause">
                <span class="clause-number">6.</span>
                I give, devise, and bequeath my estate to the following beneficiaries:
            </div>
            @foreach($will->beneficiaries as $index => $beneficiary)
            <div class="list-item">
                <strong>{{ $index + 1 }}.</strong>
                @if($beneficiary['type'] === 'person')
                    {{ $beneficiary['firstName'] ?? '' }} {{ $beneficiary['lastName'] ?? '' }}
                @else
                    {{ $beneficiary['charityName'] ?? '' }} (Charity No: {{ $beneficiary['charityNumber'] ?? 'N/A' }})
                @endif
                @if(!empty($beneficiary['percentage']))
                    - {{ $beneficiary['percentage'] }}% of my estate
                @endif
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Specific Gifts -->
        @if(!empty($will->specific_gifts))
        <div class="section">
            <div class="section-title">Specific Gifts</div>
            @foreach($will->specific_gifts as $index => $gift)
            <div class="clause">
                <span class="clause-number">{{ 7 + $index }}.</span>
                I give {{ $gift['description'] ?? '' }} to {{ $gift['recipientName'] ?? '' }}
                of {{ $gift['city'] ?? '' }}, {{ $gift['country'] ?? '' }}.
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Pets -->
        @if(!empty($will->pets))
        <div class="section">
            <div class="section-title">Care of Pets</div>
            @foreach($will->pets as $index => $pet)
            <div class="clause">
                <span class="clause-number">{{ 10 + $index }}.</span>
                I request that my pet {{ $pet['name'] ?? '' }} ({{ $pet['description'] ?? '' }}) be cared for
                @if(!empty($pet['fundAmount']))
                with a fund of £{{ $pet['fundAmount'] }} for their care
                @endif.
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Additional Clauses -->
        @if(!empty($will->additional_clauses))
        <div class="section">
            <div class="section-title">Additional Provisions</div>
            @foreach($will->additional_clauses as $index => $clause)
            <div class="clause">
                <span class="clause-number">{{ 15 + $index }}.</span>
                {{ $clause['text'] ?? '' }}
            </div>
            @endforeach
        </div>
        @endif
        
        <!-- Signature Section -->
        <div class="signature-section">
            <div class="clause">
                IN WITNESS WHEREOF I have hereunto set my hand this 
                @if(!empty($will->signing_date))
                    {{ \Carbon\Carbon::parse($will->signing_date)->format('jS \d\a\y \o\f F Y') }}
                @else
                    _____ day of _____________ 20___
                @endif
                at {{ $will->signing_city ?? '_______________' }}, {{ $will->signing_country ?? '_______________' }}.
            </div>
            
            <div class="signature-line">
                Signature of Testator: _______________________________
            </div>
            
            <div class="witness-section">
                <p><strong>Signed by the above-named Testator in our presence and attested by us in the presence of the Testator and of each other:</strong></p>
                
                <div class="witness-box">
                    <p><strong>Witness 1</strong></p>
                    <div class="field-group">
                        <span class="field-label">Signature:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Full Name:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Address:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Occupation:</span> _______________________________
                    </div>
                </div>
                
                <div class="witness-box">
                    <p><strong>Witness 2</strong></p>
                    <div class="field-group">
                        <span class="field-label">Signature:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Full Name:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Address:</span> _______________________________
                    </div>
                    <div class="field-group">
                        <span class="field-label">Occupation:</span> _______________________________
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Will ID: {{ $will->id }} | Generated: {{ now()->format('d/m/Y H:i') }}
            @if($isDraft)
                | <strong>DRAFT VERSION - NOT FOR LEGAL USE</strong>
            @endif
            </p>
        </div>
    </div>
</body>
</html>
