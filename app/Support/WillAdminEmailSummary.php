<?php

namespace App\Support;

use App\Models\Will;

class WillAdminEmailSummary
{
    /**
     * Ordered sections of label/value rows for the admin completion email.
     *
     * @return list<array{title: string, rows: list<array{label: string, value: string}>}>
     */
    public static function sections(Will $will): array
    {
        $will->loadMissing('user');

        return [
            [
                'title' => '1. Customer & Will reference',
                'rows' => self::rows([
                    'Customer name' => $will->user?->name,
                    'Customer email' => $will->user?->email,
                    'Will ID' => $will->id !== null ? '#'.$will->id : null,
                    'Will type' => $will->isSingleWill() ? 'Single will' : 'Mirror will',
                    'Status' => $will->status,
                    'Amount paid' => $will->amount !== null ? '£'.number_format((float) $will->amount, 2) : null,
                    'Paid at' => $will->paid_at?->format('d M Y H:i'),
                    'Payment reference' => $will->payment_reference,
                ]),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $pairs
     * @return list<array{label: string, value: string}>
     */
    private static function rows(array $pairs): array
    {
        $out = [];
        foreach ($pairs as $label => $value) {
            if ($value === null || $value === '') {
                continue;
            }
            $out[] = [
                'label' => (string) $label,
                'value' => is_scalar($value) ? (string) $value : '',
            ];
        }

        return $out;
    }
}
