/**
 * Stripe amounts in pence. Keep in sync with App\Enums\PaymentProduct (base + VAT).
 *
 * The £92 OPG registration fee is paid by the client directly to the Office of the Public Guardian and is not collected through Stripe.
 */
export const PAYMENT_AMOUNT_PENCE = {
    singleWill: 7800,
    mirrorWill: 9000,
    lpa: 11880,
} as const;

export function willPaymentTotalPence(willType: 'Me' | 'Mirror'): number {
    return willType === 'Mirror' ? PAYMENT_AMOUNT_PENCE.mirrorWill : PAYMENT_AMOUNT_PENCE.singleWill;
}
