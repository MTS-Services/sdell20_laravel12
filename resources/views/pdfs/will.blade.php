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
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.45;
            color: #000;
            background: #fff;
        }

        .page {
            width: 170mm;
            min-height: 297mm;
            padding: 18mm 16mm;
            position: relative;
        }

        @if ($isDraft)
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-30deg);
                font-size: 92pt;
                font-weight: bold;
                color: rgba(170, 170, 170, 0.35);
                z-index: -1;
                pointer-events: none;
                letter-spacing: 4px;
            }
        @endif

        .title {
            text-align: center;
            font-size: 11pt;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 18px;
        }

        .lead {
            margin-bottom: 22px;
            text-align: justify;
        }

        .section-heading {
            margin-top: 14px;
            margin-bottom: 6px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .sub-heading {
            margin-top: 6px;
            margin-bottom: 4px;
            font-weight: 700;
            text-decoration: underline;
        }

        .paragraph {
            margin-bottom: 8px;
            text-align: justify;
        }

        .clause-list {
            margin-left: 18px;
            margin-bottom: 8px;
        }

        .clause-list li {
            margin-bottom: 4px;
        }

        .spacer {
            height: 8px;
        }

        .signature-block {
            margin-top: 24px;
            page-break-inside: avoid;
        }

        .witness-title {
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            margin: 14px 0 10px;
        }

        .line {
            border-bottom: 1px solid #000;
            min-width: 180px;
            display: inline-block;
            height: 18px;
            vertical-align: bottom;
        }

        .witness-grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
        }

        .witness-grid td {
            width: 50%;
            vertical-align: top;
            padding-right: 14px;
        }

        .witness-line {
            margin-bottom: 6px;
            white-space: nowrap;
        }

        .meta {
            margin-top: 14px;
            font-size: 9pt;
            color: #444;
            text-align: center;
        }
    </style>
</head>

<body>
    @if ($isDraft)
        <div class="watermark">DRAFT</div>
    @endif

    <div class="page">
        @php
            $notProvided = 'Not Provided';
            $valueOr = static fn($value, $fallback = 'Not Provided') => filled($value) ? $value : $fallback;

            $fullName = trim(
                implode(
                    ' ',
                    array_filter([
                        $will->personal_info['title'] ?? '',
                        $will->personal_info['firstName'] ?? '',
                        $will->personal_info['middleName'] ?? '',
                        $will->personal_info['lastName'] ?? '',
                    ]),
                ),
            );

            $testatorAddress = trim(
                implode(
                    ', ',
                    array_filter([
                        $will->personal_info['address'] ?? '',
                        $will->personal_info['city'] ?? '',
                        $will->personal_info['postcode'] ?? '',
                        $will->personal_info['country'] ?? '',
                    ]),
                ),
            );

            $maritalStatus = $will->personal_info['maritalStatus'] ?? '';
            $spouseName = trim($will->spouse['fullName'] ?? '');

            $primaryExecutor = !empty($will->executors) ? $will->executors[0] : [];
            $executorName = trim(
                implode(
                    ' ',
                    array_filter([
                        $primaryExecutor['title'] ?? '',
                        $primaryExecutor['firstName'] ?? '',
                        $primaryExecutor['lastName'] ?? '',
                    ]),
                ),
            );

            if ($executorName === '' && $spouseName !== '') {
                $executorName = $spouseName;
            }

            $executorAddress = trim(
                implode(
                    ', ',
                    array_filter([
                        $primaryExecutor['address'] ?? '',
                        $primaryExecutor['city'] ?? '',
                        $primaryExecutor['postcode'] ?? '',
                        $primaryExecutor['country'] ?? 'England',
                    ]),
                ),
            );

            $backupExecutor = !empty($will->alternate_executors) ? $will->alternate_executors[0] : [];
            $backupName = trim(
                implode(
                    ' ',
                    array_filter([
                        $backupExecutor['title'] ?? '',
                        $backupExecutor['firstName'] ?? '',
                        $backupExecutor['lastName'] ?? '',
                    ]),
                ),
            );
            $backupAddress = trim(
                implode(
                    ', ',
                    array_filter([
                        $backupExecutor['address'] ?? '',
                        $backupExecutor['city'] ?? '',
                        $backupExecutor['postcode'] ?? '',
                        $backupExecutor['country'] ?? 'England',
                    ]),
                ),
            );

            $fallbackResidueBeneficiaries = $will->total_failure_beneficiaries ?? [];
        @endphp

        <div class="title">LAST WILL AND TESTAMENT OF {{ strtoupper($valueOr($fullName, $notProvided)) }}</div>

        <p class="lead">
            I, {{ $valueOr($fullName, $notProvided) }}, presently of {{ $valueOr($testatorAddress, $notProvided) }},
            hereby revoke all former testamentary dispositions made by me and declare this to be my Last Will.
        </p>

        <p class="section-heading">PRELIMINARY DECLARATIONS</p>

        <p class="sub-heading">Prior Wills and Codicils</p>
        <p class="paragraph">1. I revoke all prior Wills and Codicils.</p>

        <p class="sub-heading">Marital Status</p>
        <p class="paragraph">
            2.
            @if ($maritalStatus === 'married')
                I am married{{ $spouseName !== '' ? ' to ' . $spouseName : '' }}.
            @elseif($maritalStatus === 'civil-partner')
                I am in a civil partnership{{ $spouseName !== '' ? ' with ' . $spouseName : '' }}.
            @elseif($maritalStatus === 'single')
                I am not married.
            @else
                Marital status is not provided.
            @endif
        </p>

        <p class="sub-heading">Children</p>
        <p class="paragraph">
            3.
            @if (!empty($will->children) && count($will->children) > 0)
                I have the following living children:
            @else
                I do not have any living children.
            @endif
        </p>
        @if (!empty($will->children) && count($will->children) > 0)
            <ol class="clause-list" type="a">
                @foreach ($will->children as $child)
                    <li>{{ $child['fullName'] ?? trim(($child['firstName'] ?? '') . ' ' . ($child['lastName'] ?? '')) }}
                    </li>
                @endforeach
            </ol>
        @endif

        <p class="section-heading">EXECUTOR</p>

        <p class="sub-heading">Executor</p>
        <p class="paragraph">
            4. The expression "my Executor" used throughout this Will includes either the singular or plural number,
            or the masculine or feminine gender as appropriate wherever the fact or context so requires. The term
            "executor" in this Will is synonymous with and includes the terms "executrix" and "personal representative".
        </p>

        <p class="sub-heading">Appointment</p>
        <p class="paragraph">
            5. I appoint {{ $valueOr($executorName, $notProvided) }} of
            {{ $valueOr($executorAddress, 'England') }} as the sole Executor of this Will.
        </p>

        <p class="paragraph">
            6. If the person named above does not survive me or is unable or unwilling to act,
            I appoint {{ $valueOr($backupName, $notProvided) }} of
            {{ $valueOr($backupAddress, 'England') }} as substitute Executor.
        </p>

        <p class="sub-heading">Powers Of My Executor</p>
        <p class="paragraph">7. I give all powers permitted by law to my Executor, including the power to:</p>
        <ol class="clause-list" type="a">
            <li>pay my legally enforceable debts, funeral expenses, taxes, and all administration costs;</li>
            <li>sell, transfer, lease, exchange, or otherwise deal with any asset in my estate;</li>
            <li>settle and compromise any claim by or against my estate;</li>
            <li>retain estate assets for as long as my Executor considers advisable;</li>
            <li>invest and reinvest estate assets in any suitable investments;</li>
            <li>appropriate assets in satisfaction of a beneficiary's share and determine values for that purpose;</li>
            <li>employ solicitors, accountants, and other professional advisers;</li>
            <li>do all acts and things necessary for the proper administration of my estate.</li>
        </ol>

        <p class="section-heading">DISTRIBUTION OF ESTATE</p>

        <p class="sub-heading">Distribution of Estate</p>
        <p class="paragraph">
            8. Subject to payment of my debts, funeral and testamentary expenses, and taxes,
            I give my estate in accordance with the provisions below.
        </p>

        <p class="sub-heading">Specific Gifts</p>
        @if (!empty($will->specific_gifts))
            <ol class="clause-list" type="a">
                @foreach ($will->specific_gifts as $gift)
                    <li>
                        I give
                        {{ $valueOr($gift['description'] ?? null, 'the specific gift described in my records') }} to
                        {{ $valueOr($gift['recipientName'] ?? null, 'the beneficiary named in my records') }}.
                    </li>
                @endforeach
            </ol>
        @else
            <p class="paragraph">No specific gifts are recorded.</p>
        @endif

        <p class="sub-heading">Residuary Estate</p>
        @if (!empty($will->beneficiaries))
            <p class="paragraph">9. I give all the rest, residue, and remainder of my estate to the following
                beneficiary(ies):</p>
            <ol class="clause-list" type="a">
                @foreach ($will->beneficiaries as $beneficiary)
                    <li>
                        @if (($beneficiary['type'] ?? 'person') === 'person')
                            {{ $valueOr(trim(($beneficiary['firstName'] ?? '') . ' ' . ($beneficiary['lastName'] ?? '')), $notProvided) }}
                        @else
                            {{ $beneficiary['charityName'] ?? 'Unnamed charity' }}
                            @if (!empty($beneficiary['charityNumber']))
                                (Charity Number: {{ $beneficiary['charityNumber'] }})
                            @endif
                        @endif
                        @if (!empty($beneficiary['percentage']))
                            - {{ $beneficiary['percentage'] }}%
                        @endif
                    </li>
                @endforeach
            </ol>
        @elseif(!empty($fallbackResidueBeneficiaries))
            <p class="paragraph">9. I give all the rest, residue, and remainder of my estate to the following fallback
                beneficiary(ies):</p>
            <ol class="clause-list" type="a">
                @foreach ($fallbackResidueBeneficiaries as $beneficiary)
                    <li>
                        @if (($beneficiary['type'] ?? 'person') === 'person')
                            {{ $valueOr(trim(($beneficiary['firstName'] ?? '') . ' ' . ($beneficiary['lastName'] ?? '')), $notProvided) }}
                        @else
                            {{ $valueOr($beneficiary['charityName'] ?? null, 'Unnamed charity') }}
                        @endif
                    </li>
                @endforeach
            </ol>
        @else
            <p class="paragraph">9. I give all the rest, residue, and remainder of my estate to {{ $notProvided }}.
            </p>
        @endif

        <p class="sub-heading">Survivorship</p>
        <p class="paragraph">
            10. A beneficiary must survive me by 30 days to receive a gift under this Will,
            unless this Will expressly states otherwise.
        </p>

        <p class="section-heading">GUARDIANSHIP</p>
        <p class="sub-heading">Guardians of Minor Children</p>
        @if (!empty($will->guardians))
            <p class="paragraph">11. If at my death any child of mine is under 18 years of age, I appoint the following
                as guardian(s):</p>
            <ol class="clause-list" type="a">
                @foreach ($will->guardians as $guardian)
                    <li>{{ $valueOr($guardian['fullName'] ?? null, 'Unnamed guardian') }}</li>
                @endforeach
            </ol>
        @else
            <p class="paragraph">11. No guardian is recorded in this draft.</p>
        @endif

        <p class="section-heading">SPECIAL REQUESTS</p>
        <p class="sub-heading">Care of Pets</p>
        @if (!empty($will->pets))
            <ol class="clause-list" type="a">
                @foreach ($will->pets as $pet)
                    <li>
                        I request appropriate care for my pet {{ $valueOr($pet['name'] ?? null, 'Unnamed Pet') }}
                        @if (!empty($pet['description']))
                            ({{ $pet['description'] }})
                        @endif
                        @if (!empty($pet['fundAmount']))
                            with provision of £{{ $pet['fundAmount'] }} from my estate.
                        @else
                            from my estate.
                        @endif
                    </li>
                @endforeach
            </ol>
        @else
            <p class="paragraph">No pet care request is recorded.</p>
        @endif

        <p class="section-heading">ADDITIONAL PROVISIONS</p>
        @if (!empty($will->additional_clauses))
            <ol class="clause-list" type="a">
                @foreach ($will->additional_clauses as $clause)
                    <li>{{ $valueOr($clause['text'] ?? null, $notProvided) }}</li>
                @endforeach
            </ol>
        @else
            <p class="paragraph">No additional provisions are recorded.</p>
        @endif

        <p class="sub-heading">Governing Law</p>
        <p class="paragraph">12. This Will is governed by and construed in accordance with the laws of England and
            Wales.</p>

        <div class="signature-block">
            <p class="paragraph">
                Signed by me on
                @if (!empty($will->signing_date))
                    {{ \Carbon\Carbon::parse($will->signing_date)->format('j F Y') }}
                @else
                    {{ $notProvided }}
                @endif
                at {{ $valueOr($will->signing_city ?? null, $notProvided) }},
                {{ $valueOr($will->signing_country ?? null, $notProvided) }}.
            </p>

            <p class="paragraph">Testator Signature: <span class="line"></span></p>

            <p class="witness-title">WITNESSES</p>
            <p class="paragraph">
                This instrument was signed and declared as a Last Will by the Testator in our joint presence,
                and then signed by us in the Testator's presence and in the presence of each other.
            </p>

            <table class="witness-grid">
                <tr>
                    <td>
                        <p class="witness-line">Signature: <span class="line"></span></p>
                        <p class="witness-line">Name: <span class="line"></span></p>
                        <p class="witness-line">Address: <span class="line"></span></p>
                        <p class="witness-line">City/Town: <span class="line"></span></p>
                        <p class="witness-line">Postcode: <span class="line"></span></p>
                    </td>
                    <td>
                        <p class="witness-line">Signature: <span class="line"></span></p>
                        <p class="witness-line">Name: <span class="line"></span></p>
                        <p class="witness-line">Address: <span class="line"></span></p>
                        <p class="witness-line">City/Town: <span class="line"></span></p>
                        <p class="witness-line">Postcode: <span class="line"></span></p>
                    </td>
                </tr>
            </table>
        </div>

        <p class="meta">
            Will ID: {{ $will->id }} | Generated: {{ now()->format('d/m/Y H:i') }}
            @if ($isDraft)
                | DRAFT VERSION
            @endif
        </p>
    </div>
</body>

</html>
