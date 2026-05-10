<?php

namespace App\Support;

use App\Models\Lpa;

class LpaAdminEmailSummary
{
    /**
     * Ordered sections of label/value rows for the admin completion email.
     *
     * @return list<array{title: string, rows: list<array{label: string, value: string}>}>
     */
    public static function sections(Lpa $lpa): array
    {
        $sections = [];

        $sections[] = [
            'title' => '1. Customer & LPA reference',
            'rows' => self::rows([
                'Customer name' => $lpa->user?->name,
                'Customer email' => $lpa->user?->email,
                'LPA ID' => $lpa->id !== null ? '#' . $lpa->id : null,
                'Who the LPA is for' => $lpa->who_for,
                'Document type' => self::documentTypeLabel($lpa),
                'Status' => $lpa->status,
                'Amount paid' => $lpa->amount !== null ? '£' . number_format((float) $lpa->amount, 2) : null,
                'Paid at' => $lpa->paid_at?->format('d M Y H:i'),
                'Payment reference' => $lpa->payment_reference,
            ]),
        ];

        $donorRows = self::donorRows($lpa->donor_details ?? []);
        $sections[] = [
            'title' => '2. Donor (section 1)',
            'rows' => $donorRows !== [] ? $donorRows : [['label' => 'Donor details', 'value' => 'Not recorded']],
        ];

        $contactRows = self::contactRows($lpa->contact_details ?? []);
        $sections[] = [
            'title' => '3. Contact & address',
            'rows' => $contactRows !== [] ? $contactRows : [['label' => 'Contact', 'value' => 'Not recorded']],
        ];

        $sections[] = [
            'title' => '4. Attorneys',
            'rows' => self::attorneysRows($lpa->attorneys ?? []),
        ];

        $sections[] = [
            'title' => '5. Attorney access & replacements',
            'rows' => self::rows([
                'Attorneys may view legal documents' => self::boolText($lpa->can_view_documents),
                'Wants replacement attorneys' => self::boolText($lpa->want_replacement_attorneys),
            ])->merge(self::replacementRows($lpa->replacement_attorneys ?? []))->all(),
        ];

        $sections[] = [
            'title' => '6. Life-sustaining treatment & people to notify',
            'rows' => self::rows([
                'Life-sustaining treatment (attorneys may decide)' => self::nullableBoolText($lpa->life_sustaining_treatment),
                'People to notify (yes/no)' => self::boolText($lpa->notify_people),
            ]),
        ];

        $sections[] = [
            'title' => '7. Registration & recipient',
            'rows' => self::rows([
                'Applicant (who registers with OPG)' => $lpa->applicant,
                'Document recipient' => $lpa->document_recipient,
                'Certificate provider details captured now' => self::boolText($lpa->certificate_choice),
            ]),
        ];

        $sections[] = [
            'title' => '8. LP1H / LP1F extended answers (lp1h_form JSON)',
            'rows' => self::lp1hFormRows($lpa->lp1h_form ?? []),
        ];

        $sections[] = [
            'title' => '9. Files',
            'rows' => self::rows([
                'PDF path (storage)' => $lpa->pdf_path,
                'PDF generated at' => $lpa->pdf_generated_at?->format('d M Y H:i'),
            ]),
        ];

        return array_values(array_filter($sections, fn(array $s): bool => count($s['rows']) > 0));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return \Illuminate\Support\Collection<int, array{label: string, value: string}>
     */
    private static function rows(array $data): \Illuminate\Support\Collection
    {
        $out = collect();

        foreach ($data as $label => $value) {
            $text = self::scalar($value);

            if ($text === '') {
                continue;
            }

            $out->push(['label' => (string) $label, 'value' => $text]);
        }

        return $out;
    }

    /**
     * @param  array<string, mixed>  $donor
     * @return list<array{label: string, value: string}>
     */
    private static function donorRows(array $donor): array
    {
        $dob = self::joinNonEmpty('/', [
            $donor['birthDay'] ?? '',
            $donor['birthMonth'] ?? '',
            $donor['birthYear'] ?? '',
        ]);

        return self::rows([
            'Title' => $donor['title'] ?? null,
            'First name(s)' => $donor['firstName'] ?? null,
            'Middle name(s)' => $donor['middleNames'] ?? null,
            'Last name' => $donor['lastName'] ?? null,
            'Preferred / known as' => $donor['preferredName'] ?? null,
            'Other names' => $donor['otherNames'] ?? null,
            'Date of birth' => $dob !== '//' ? $dob : null,
        ])->all();
    }

    /**
     * @param  array<string, mixed>  $contact
     * @return list<array{label: string, value: string}>
     */
    private static function contactRows(array $contact): array
    {
        $lines = array_filter([
            $contact['addressLine1'] ?? '',
            $contact['addressLine2'] ?? '',
            trim(implode(', ', array_filter([
                $contact['town'] ?? '',
                $contact['county'] ?? '',
                $contact['country'] ?? '',
            ]))),
            $contact['postcode'] ?? '',
        ]);

        $rows = self::rows([
            'Address' => count($lines) ? implode("\n", $lines) : null,
            'Mobile' => $contact['mobile'] ?? null,
            'Landline' => $contact['landline'] ?? null,
            'Email' => $contact['email'] ?? null,
        ]);

        return $rows->all();
    }

    /**
     * @param  list<array<string, mixed>>|null  $attorneys
     * @return list<array{label: string, value: string}>
     */
    private static function attorneysRows(?array $attorneys): array
    {
        if ($attorneys === null || $attorneys === []) {
            return [['label' => 'Attorneys', 'value' => 'None recorded']];
        }

        $rows = collect();

        foreach ($attorneys as $index => $a) {
            if (! is_array($a)) {
                continue;
            }

            $n = (int) $index + 1;
            $name = self::joinNonEmpty(' ', [
                $a['title'] ?? '',
                $a['firstName'] ?? '',
                $a['middleNames'] ?? '',
                $a['lastName'] ?? '',
            ]);
            $dob = self::joinNonEmpty('/', [$a['birthDay'] ?? '', $a['birthMonth'] ?? '', $a['birthYear'] ?? '']);
            $addr = self::joinNonEmpty("\n", [
                $a['addressLine1'] ?? '',
                $a['addressLine2'] ?? '',
                self::joinNonEmpty(', ', [$a['town'] ?? '', $a['county'] ?? '', $a['postcode'] ?? '']),
            ]);

            $rows->push(['label' => "Attorney {$n} — name", 'value' => $name !== '' ? $name : '—']);
            $rows->push(['label' => "Attorney {$n} — DOB", 'value' => $dob !== '//' ? $dob : '—']);
            $rows->push(['label' => "Attorney {$n} — address", 'value' => $addr !== '' ? $addr : '—']);
            $rows->push(['label' => "Attorney {$n} — email", 'value' => self::scalar($a['email'] ?? '') ?: '—']);
        }

        return $rows->all();
    }

    /**
     * @param  list<array<string, mixed>>|null  $replacements
     * @return \Illuminate\Support\Collection<int, array{label: string, value: string}>
     */
    private static function replacementRows(?array $replacements): \Illuminate\Support\Collection
    {
        $rows = collect();

        if ($replacements === null || $replacements === []) {
            return $rows;
        }

        foreach ($replacements as $index => $a) {
            if (! is_array($a)) {
                continue;
            }

            $n = (int) $index + 1;
            $name = self::joinNonEmpty(' ', [
                $a['title'] ?? '',
                $a['firstName'] ?? '',
                $a['middleNames'] ?? '',
                $a['lastName'] ?? '',
            ]);
            $dob = self::joinNonEmpty('/', [$a['birthDay'] ?? '', $a['birthMonth'] ?? '', $a['birthYear'] ?? '']);
            $addr = self::joinNonEmpty("\n", [
                $a['addressLine1'] ?? '',
                $a['addressLine2'] ?? '',
                self::joinNonEmpty(', ', [$a['town'] ?? '', $a['county'] ?? '', $a['postcode'] ?? '']),
            ]);

            $rows->push(['label' => "Replacement {$n} — name", 'value' => $name !== '' ? $name : '—']);
            $rows->push(['label' => "Replacement {$n} — DOB", 'value' => $dob !== '//' ? $dob : '—']);
            $rows->push(['label' => "Replacement {$n} — address", 'value' => $addr !== '' ? $addr : '—']);
        }

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $form
     * @return list<array{label: string, value: string}>
     */
    private static function lp1hFormRows(array $form): array
    {
        if ($form === []) {
            return [['label' => 'Extended form', 'value' => 'No extra data submitted']];
        }

        $acting = match ($form['attorney_acting'] ?? '') {
            'jointly_and_severally' => 'Jointly and severally',
            'jointly' => 'Jointly',
            'mixed' => 'Joint for some, jointly and severally for others',
            'single_attorney' => 'Single attorney only',
            default => self::scalar($form['attorney_acting'] ?? ''),
        };

        $whenAct = match ($form['when_attorneys_can_act'] ?? '') {
            'as_soon_registered' => 'As soon as the LPA is registered (and when the donor lacks mental capacity)',
            'only_without_capacity' => 'Only when the donor does not have mental capacity',
            default => self::scalar($form['when_attorneys_can_act'] ?? ''),
        };

        $rows = self::rows([
            'How attorneys act (LP1H/LP1F section 3)' => $acting !== '' ? $acting : null,
            'When attorneys can act (LP1F section 5)' => $whenAct !== '' ? $whenAct : null,
            'Preferences (section 7)' => $form['preferences'] ?? null,
            'Instructions (section 7)' => $form['instructions'] ?? null,
            'Complete signatures on paper only' => isset($form['complete_signatures_on_paper']) ? self::boolText((bool) $form['complete_signatures_on_paper']) : null,
        ]);

        if (! empty($form['people_to_notify']) && is_array($form['people_to_notify'])) {
            foreach ($form['people_to_notify'] as $i => $p) {
                if (! is_array($p)) {
                    continue;
                }

                $n = (int) $i + 1;
                $name = self::joinNonEmpty(' ', [$p['title'] ?? '', $p['firstName'] ?? '', $p['lastName'] ?? '']);
                $rows->push(['label' => "Person to notify {$n}", 'value' => $name]);
                $rows->push(['label' => "Person to notify {$n} — address", 'value' => self::joinNonEmpty(', ', [$p['addressLine1'] ?? '', $p['postcode'] ?? ''])]);
            }
        }

        if (! empty($form['life_sustaining']) && is_array($form['life_sustaining'])) {
            $ls = $form['life_sustaining'];
            $rows = $rows->merge(self::rows([
                'Life-sustaining — donor typed signature' => $ls['donor_typed_signature'] ?? null,
                'Life-sustaining — date' => self::joinNonEmpty('/', [$ls['sign_day'] ?? '', $ls['sign_month'] ?? '', $ls['sign_year'] ?? '']),
                'Life-sustaining — witness name' => $ls['witness_full_name'] ?? null,
                'Life-sustaining — witness address' => $ls['witness_address'] ?? null,
                'Life-sustaining — witness postcode' => $ls['witness_postcode'] ?? null,
                'Life-sustaining — witness typed' => $ls['witness_typed_signature'] ?? null,
            ]));
        }

        if (! empty($form['section_9']) && is_array($form['section_9'])) {
            $s9 = $form['section_9'];
            $rows = $rows->merge(self::rows([
                'Section 9 — donor typed signature' => $s9['donor_typed_signature'] ?? null,
                'Section 9 — date' => self::joinNonEmpty('/', [$s9['sign_day'] ?? '', $s9['sign_month'] ?? '', $s9['sign_year'] ?? '']),
                'Section 9 — witness name' => $s9['witness_full_name'] ?? null,
                'Section 9 — witness address' => $s9['witness_address'] ?? null,
                'Section 9 — witness postcode' => $s9['witness_postcode'] ?? null,
            ]));
        }

        if (! empty($form['certificate_provider']) && is_array($form['certificate_provider'])) {
            $cp = $form['certificate_provider'];
            $rows = $rows->merge(self::rows([
                'Certificate provider — name' => self::joinNonEmpty(' ', [$cp['title'] ?? '', $cp['first_name'] ?? '', $cp['last_name'] ?? '']),
                'Certificate provider — address' => $cp['address_line1'] ?? null,
                'Certificate provider — postcode' => $cp['postcode'] ?? null,
                'Certificate provider — typed signature' => $cp['typed_signature'] ?? null,
                'Certificate provider — date' => self::joinNonEmpty('/', [$cp['sign_day'] ?? '', $cp['sign_month'] ?? '', $cp['sign_year'] ?? '']),
            ]));
        }

        if (! empty($form['attorney_deed_signatures']) && is_array($form['attorney_deed_signatures'])) {
            foreach ($form['attorney_deed_signatures'] as $i => $row) {
                if (! is_array($row)) {
                    continue;
                }

                $n = (int) $i + 1;
                $role = $row['role_label'] ?? 'Attorney';
                $rows->push(['label' => "Deed signature {$n} ({$role})", 'value' => $row['typed_signature'] ?? '—']);
                $rows->push(['label' => "Deed signature {$n} — date", 'value' => self::joinNonEmpty('/', [$row['sign_day'] ?? '', $row['sign_month'] ?? '', $row['sign_year'] ?? ''])]);
                $rows->push(['label' => "Deed signature {$n} — witness", 'value' => self::joinNonEmpty("\n", [
                    $row['witness_full_name'] ?? '',
                    $row['witness_address'] ?? '',
                    $row['witness_postcode'] ?? '',
                ])]);
            }
        }

        if (! empty($form['section_15']) && is_array($form['section_15'])) {
            $s15 = $form['section_15'];
            $rows = $rows->merge(self::rows([
                'Section 15 — applicant typed signature' => $s15['typed_signature'] ?? null,
                'Section 15 — date' => self::joinNonEmpty('/', [$s15['sign_day'] ?? '', $s15['sign_month'] ?? '', $s15['sign_year'] ?? '']),
            ]));
        }

        if (! empty($form['recipient_other']) && is_array($form['recipient_other'])) {
            $ro = $form['recipient_other'];
            $rows = $rows->merge(self::rows([
                'Other recipient — name' => self::joinNonEmpty(' ', [$ro['title'] ?? '', $ro['first_name'] ?? '', $ro['last_name'] ?? '']),
                'Other recipient — company' => $ro['company'] ?? null,
                'Other recipient — address' => $ro['address_line1'] ?? null,
                'Other recipient — postcode' => $ro['postcode'] ?? null,
            ]));
        }

        if (! empty($form['recipient_contact_prefs']) && is_array($form['recipient_contact_prefs'])) {
            $rcp = $form['recipient_contact_prefs'];
            $prefs = [];
            if (! empty($rcp['post'])) {
                $prefs[] = 'Post';
            }
            if (! empty($rcp['phone'])) {
                $prefs[] = 'Phone';
            }
            if (! empty($rcp['email'])) {
                $prefs[] = 'Email';
            }
            if (! empty($rcp['welsh'])) {
                $prefs[] = 'Welsh';
            }
            $rows->push(['label' => 'Recipient contact preferences', 'value' => $prefs !== [] ? implode(', ', $prefs) : '—']);
        }

        return $rows->all();
    }

    private static function documentTypeLabel(Lpa $lpa): string
    {
        if ($lpa->isBoth()) {
            return 'Health & welfare and property & finance (both)';
        }

        if ($lpa->isPropertyAndFinance()) {
            return 'Property & financial affairs';
        }

        if ($lpa->isHealthAndWelfare()) {
            return 'Health & welfare';
        }

        return (string) ($lpa->document_type ?? 'N/A');
    }

    private static function boolText(?bool $value): string
    {
        if ($value === null) {
            return 'Not set';
        }

        return $value ? 'Yes' : 'No';
    }

    private static function nullableBoolText(?bool $value): string
    {
        if ($value === null) {
            return 'Not applicable / not set';
        }

        return $value ? 'Yes (attorneys may give or refuse consent)' : 'No (doctors decide)';
    }

    private static function scalar(mixed $value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }

        if (is_scalar($value)) {
            return trim((string) $value);
        }

        return '';
    }

    /**
     * @param  list<string>  $parts
     */
    private static function joinNonEmpty(string $glue, array $parts): string
    {
        $filtered = array_values(array_filter($parts, fn($p): bool => $p !== null && trim((string) $p) !== ''));

        return implode($glue, $filtered);
    }
}
