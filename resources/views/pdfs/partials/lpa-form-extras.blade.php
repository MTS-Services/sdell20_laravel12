@php
    /** @var \App\Models\Lpa $lpa */
    $extras = is_array($lpa->lp1h_form ?? null) ? $lpa->lp1h_form : [];
    $line = static function (?string $v, int $max = 500): string {
        $t = trim(preg_replace('/\s+/', ' ', strip_tags((string) $v)));

        return e(substr($t, 0, $max));
    };
    $actingLabels = [
        'jointly_and_severally' => 'Jointly and severally',
        'jointly' => 'Jointly (all must agree every decision)',
        'mixed' => 'Jointly for some decisions, jointly and severally for others (continuation sheet required)',
        'single_attorney' => 'Only one attorney appointed',
    ];
    $acting = $extras['attorney_acting'] ?? '';
    $actingLabel = $actingLabels[$acting] ?? ($acting !== '' ? $acting : '—');

    $whenLabels = [
        'as_soon_registered' => 'As soon as the LPA has been registered (and when the donor lacks mental capacity)',
        'only_without_capacity' => 'Only when the donor does not have mental capacity',
    ];
    $when = $extras['when_attorneys_can_act'] ?? '';
    $whenLabel = $whenLabels[$when] ?? ($when !== '' ? $when : '');
@endphp

<div class="section" style="margin-top: 10px;">
    <div class="section-title">Section 3 — How your attorneys should work together</div>
    <div class="field-group">
        <div class="field-label">Your choice (LP1H / LP1F section 3)</div>
        <div class="field-value">{{ $line($actingLabel, 200) }}</div>
    </div>
</div>

@if ($whenLabel !== '')
    <div class="section">
        <div class="section-title">Section 5 (LP1F) — When your attorneys can make decisions</div>
        <div class="field-group">
            <div class="field-label">Your choice</div>
            <div class="field-value">{{ $line($whenLabel, 240) }}</div>
        </div>
    </div>
@endif

<div class="section">
    <div class="section-title">Section 7 — Preferences and instructions (optional)</div>
    <div class="field-group">
        <div class="field-label">Preferences</div>
        <div class="field-value" style="min-height: 36px;">{{ $line($extras['preferences'] ?? '', 2000) }}</div>
    </div>
    <div class="field-group">
        <div class="field-label">Instructions</div>
        <div class="field-value" style="min-height: 36px;">{{ $line($extras['instructions'] ?? '', 2000) }}</div>
    </div>
</div>

@if (!empty($extras['people_to_notify']) && is_array($extras['people_to_notify']))
    <div class="section">
        <div class="section-title">Section 6 — People to notify</div>
        @foreach ($extras['people_to_notify'] as $i => $p)
            @if (is_array($p))
                <div class="field-row" style="margin-bottom: 6px;">
                    <div class="field-group">
                        <div class="field-label">Person {{ $i + 1 }} — name</div>
                        <div class="field-value">
                            {{ $line(trim(($p['title'] ?? '') . ' ' . ($p['firstName'] ?? '') . ' ' . ($p['lastName'] ?? '')), 120) }}
                        </div>
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Address / Postcode</div>
                    <div class="field-value">{{ $line($p['addressLine1'] ?? '', 120) }} @if (!empty($p['postcode']))
                            — {{ $line($p['postcode'] ?? '', 20) }}
                        @endif
                    </div>
                </div>
            @endif
        @endforeach
    </div>
@endif

@php $ls = is_array($extras['life_sustaining'] ?? null) ? $extras['life_sustaining'] : []; @endphp
@if ($lpa->isHealthAndWelfare() || $lpa->isBoth())
    <div class="section">
        <div class="section-title">Section 5 — Life-sustaining treatment (signatures as captured online)</div>
        <div class="field-group">
            <div class="field-label">Donor typed name / mark</div>
            <div class="field-value">{{ $line($ls['donor_typed_signature'] ?? '', 120) }}</div>
        </div>
        <div class="field-group">
            <div class="field-label">Date signed (day / month / year)</div>
            <div class="field-value">
                {{ $line($ls['sign_day'] ?? '', 2) }} / {{ $line($ls['sign_month'] ?? '', 2) }} /
                {{ $line($ls['sign_year'] ?? '', 4) }}
            </div>
        </div>
        <div class="field-group">
            <div class="field-label">Witness — full name</div>
            <div class="field-value">{{ $line($ls['witness_full_name'] ?? '', 120) }}</div>
        </div>
        <div class="field-group">
            <div class="field-label">Witness — address / postcode</div>
            <div class="field-value">{{ $line($ls['witness_address'] ?? '', 200) }} @if (!empty($ls['witness_postcode']))
                    — {{ $line($ls['witness_postcode'] ?? '', 20) }}
                @endif
            </div>
        </div>
        <div class="field-group">
            <div class="field-label">Witness typed name</div>
            <div class="field-value">{{ $line($ls['witness_typed_signature'] ?? '', 120) }}</div>
        </div>
    </div>
@endif

@php $s9 = is_array($extras['section_9'] ?? null) ? $extras['section_9'] : []; @endphp
<div class="section">
    <div class="section-title">Section 9 — Donor signature (as captured online)</div>
    <div class="field-group">
        <div class="field-label">Donor typed name / mark</div>
        <div class="field-value">{{ $line($s9['donor_typed_signature'] ?? '', 120) }}</div>
    </div>
    <div class="field-group">
        <div class="field-label">Date (day / month / year)</div>
        <div class="field-value">{{ $line($s9['sign_day'] ?? '', 2) }} / {{ $line($s9['sign_month'] ?? '', 2) }} /
            {{ $line($s9['sign_year'] ?? '', 4) }}</div>
    </div>
    <div class="field-group">
        <div class="field-label">Witness — full name / address / postcode</div>
        <div class="field-value">{{ $line($s9['witness_full_name'] ?? '', 120) }} —
            {{ $line($s9['witness_address'] ?? '', 200) }} @if (!empty($s9['witness_postcode']))
                — {{ $line($s9['witness_postcode'] ?? '', 20) }}
            @endif
        </div>
    </div>
</div>

@php $cp = is_array($extras['certificate_provider'] ?? null) ? $extras['certificate_provider'] : []; @endphp
@if ($lpa->certificate_choice)
    <div class="section">
        <div class="section-title">Section 10 — Certificate provider</div>
        <div class="field-row">
            <div class="field-group">
                <div class="field-label">Title / First / Last</div>
                <div class="field-value">
                    {{ $line(trim(($cp['title'] ?? '') . ' ' . ($cp['first_name'] ?? '') . ' ' . ($cp['last_name'] ?? '')), 160) }}
                </div>
            </div>
        </div>
        <div class="field-group">
            <div class="field-label">Address / Postcode</div>
            <div class="field-value">{{ $line($cp['address_line1'] ?? '', 200) }} @if (!empty($cp['postcode']))
                    — {{ $line($cp['postcode'] ?? '', 20) }}
                @endif
            </div>
        </div>
        <div class="field-group">
            <div class="field-label">Typed signature / date</div>
            <div class="field-value">{{ $line($cp['typed_signature'] ?? '', 120) }} —
                {{ $line($cp['sign_day'] ?? '', 2) }}/{{ $line($cp['sign_month'] ?? '', 2) }}/{{ $line($cp['sign_year'] ?? '', 4) }}
            </div>
        </div>
    </div>
@endif

@if (!empty($extras['attorney_deed_signatures']) && is_array($extras['attorney_deed_signatures']))
    <div class="section">
        <div class="section-title">Section 11 — Attorney / replacement signatures (as captured online)</div>
        @foreach ($extras['attorney_deed_signatures'] as $idx => $row)
            @if (is_array($row))
                <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #ccc;">
                    <div class="field-label">Party {{ (int) $idx + 1 }}
                        ({{ $line($row['role_label'] ?? 'Attorney', 40) }})
                    </div>
                    <div class="field-value">{{ $line($row['typed_signature'] ?? '', 120) }} — dated
                        {{ $line($row['sign_day'] ?? '', 2) }}/{{ $line($row['sign_month'] ?? '', 2) }}/{{ $line($row['sign_year'] ?? '', 4) }}
                    </div>
                    <div class="field-label" style="margin-top: 2px;">Witness</div>
                    <div class="field-value">{{ $line($row['witness_full_name'] ?? '', 120) }} —
                        {{ $line($row['witness_address'] ?? '', 200) }} @if (!empty($row['witness_postcode']))
                            — {{ $line($row['witness_postcode'] ?? '', 20) }}
                        @endif
                    </div>
                </div>
            @endif
        @endforeach
    </div>
@endif

@php $s15 = is_array($extras['section_15'] ?? null) ? $extras['section_15'] : []; @endphp
<div class="section">
    <div class="section-title">Section 15 — Applicant signature (registration)</div>
    <div class="field-group">
        <div class="field-label">Typed name / mark</div>
        <div class="field-value">{{ $line($s15['typed_signature'] ?? '', 120) }}</div>
    </div>
    <div class="field-group">
        <div class="field-label">Date</div>
        <div class="field-value">
            {{ $line($s15['sign_day'] ?? '', 2) }}/{{ $line($s15['sign_month'] ?? '', 2) }}/{{ $line($s15['sign_year'] ?? '', 4) }}
        </div>
    </div>
</div>

@if (!empty($extras['recipient_other']) && is_array($extras['recipient_other']))
    @php $ro = $extras['recipient_other']; @endphp
    <div class="section">
        <div class="section-title">Section 13 — Other recipient (if chosen)</div>
        <div class="field-value">
            {{ $line(trim(($ro['title'] ?? '') . ' ' . ($ro['first_name'] ?? '') . ' ' . ($ro['last_name'] ?? '')), 160) }}
        </div>
        @if (!empty($ro['company']))
            <div class="field-value">{{ $line($ro['company'] ?? '', 120) }}</div>
        @endif
        <div class="field-value">{{ $line($ro['address_line1'] ?? '', 200) }} — {{ $line($ro['postcode'] ?? '', 20) }}
        </div>
    </div>
@endif

@if (!empty($extras['recipient_contact_prefs']) && is_array($extras['recipient_contact_prefs']))
    @php $rcp = $extras['recipient_contact_prefs']; @endphp
    <div class="section">
        <div class="section-title">Contact preferences (Section 13)</div>
        <div class="field-value">
            @if (!empty($rcp['post']))
                Post
            @endif
            @if (!empty($rcp['phone']))
                Phone
            @endif
            @if (!empty($rcp['email']))
                Email
            @endif
            @if (!empty($rcp['welsh']))
                Welsh correspondence
            @endif
            @if (empty($rcp['post']) && empty($rcp['phone']) && empty($rcp['email']) && empty($rcp['welsh']))
                —
            @endif
        </div>
    </div>
@endif

@if (!empty($extras['complete_signatures_on_paper']))
    <div class="section">
        <div class="field-value" style="border: 2px dashed #333;">
            <strong>Note:</strong> The donor chose to complete wet ink signatures on the printed LP1H instead of
            capturing all signatures online.
        </div>
    </div>
@endif
