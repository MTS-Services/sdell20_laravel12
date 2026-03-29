import CheckoutForm from '@/components/checkout-form';
import { PAYMENT_AMOUNT_PENCE } from '@/lib/paymentAmounts';

interface Props {
    amount: number;
    currency?: string;
    paymentId?: number | null;
    product?: string | null;
    redirectUrl?: string | null;
}

export default function Checkout({
    amount = PAYMENT_AMOUNT_PENCE.lpa,
    currency = 'gbp',
    paymentId = null,
    product = null,
    redirectUrl = null,
}: Props) {
    return (
        <CheckoutForm
            amount={amount}
            currency={currency}
            paymentId={paymentId}
            product={product}
            redirectUrl={redirectUrl}
        />
    );
}
