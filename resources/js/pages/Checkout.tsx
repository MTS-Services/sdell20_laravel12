import CheckoutForm from '@/components/checkout-form';

interface Props {
    amount: number;
    currency?: string;
    paymentId?: number | null;
    product?: string | null;
    redirectUrl?: string | null;
}

export default function Checkout({
    amount = 9900,
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
