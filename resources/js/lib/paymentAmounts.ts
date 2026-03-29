/**
 * Stripe amounts in pence. Keep in sync with App\Enums\PaymentProduct (base + VAT + OPG fee for LPAs).
 */
export const PAYMENT_AMOUNT_PENCE = {
    singleWill: 7800,
    mirrorWill: 9000,
    lpa: 19400,
} as const;

export function willPaymentTotalPence(willType: 'Me' | 'Mirror'): number {
    return willType === 'Mirror' ? PAYMENT_AMOUNT_PENCE.mirrorWill : PAYMENT_AMOUNT_PENCE.singleWill;
}
