import CheckoutForm from '@/components/checkout-form';

interface Props {
    amount: number;
    currency?: string;
    paymentId?: number | null;
}

export default function Checkout({
    amount = 9900,
    currency = 'gbp',
    paymentId = null,
}: Props) {
    return (
        <CheckoutForm
            amount={amount}
            currency={currency}
            paymentId={paymentId}
        />
    );
}
